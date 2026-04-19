const {
  Events,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ChannelType,
  PermissionFlagsBits,
} = require('discord.js');
const { readSettings } = require('../utils/storage');

const reviewDrafts = new Map();

module.exports = {
  name: 'interactionCreate',

  async execute(interaction) {
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);
      if (!command) return;

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(`Error executing /${interaction.commandName}:`, error);
        const payload = { content: 'There was an error while running that command.', flags: 64 };

        if (interaction.replied || interaction.deferred) {
          await interaction.followUp(payload);
        } else {
          await interaction.reply(payload);
        }
      }

      return;
    }

    if (interaction.isButton()) {
      if (interaction.customId === 'ticket_open') {
        await handleTicketOpen(interaction);
        return;
      }

      if (interaction.customId === 'ticket_close') {
        await interaction.reply({ content: 'Closing ticket in 3 seconds...', flags: 64 });
        setTimeout(async () => {
          try {
            await interaction.channel.delete('Ticket closed with button');
          } catch (error) {
            console.error('Failed to close ticket:', error);
          }
        }, 3000);
        return;
      }

      if (interaction.customId === 'review_open') {
        const menu = new StringSelectMenuBuilder()
          .setCustomId('review_star_select')
          .setPlaceholder('Choose a star rating')
          .addOptions([
            { label: '1 Star', value: '1', description: 'Very poor' },
            { label: '2 Stars', value: '2', description: 'Needs improvement' },
            { label: '3 Stars', value: '3', description: 'Average' },
            { label: '4 Stars', value: '4', description: 'Great' },
            { label: '5 Stars', value: '5', description: 'Excellent' },
          ]);

        const row = new ActionRowBuilder().addComponents(menu);
        await interaction.reply({ content: 'Choose your star rating below.', components: [row], flags: 64 });
        return;
      }
    }

    if (interaction.isStringSelectMenu() && interaction.customId === 'review_star_select') {
      const selectedStars = Number(interaction.values[0]);
      reviewDrafts.set(interaction.user.id, { stars: selectedStars });

      const modal = new ModalBuilder()
        .setCustomId('review_comment_modal')
        .setTitle('Leave Your Review');

      const commentInput = new TextInputBuilder()
        .setCustomId('review_comment')
        .setLabel('Tell us about your experience')
        .setStyle(TextInputStyle.Paragraph)
        .setPlaceholder('Write your review here...')
        .setRequired(true)
        .setMaxLength(1000);

      const row = new ActionRowBuilder().addComponents(commentInput);
      modal.addComponents(row);

      await interaction.showModal(modal);
      return;
    }

    if (interaction.isModalSubmit() && interaction.customId === 'review_comment_modal') {
      const settings = readSettings();
      const reviewChannelId = settings.reviewChannelId;

      if (!reviewChannelId) {
        await interaction.reply({
          content: 'No review channel has been set yet. Run `/setreviewchannel` first.',
          flags: 64,
        });
        return;
      }

      const reviewChannel = interaction.guild.channels.cache.get(reviewChannelId);
      if (!reviewChannel) {
        await interaction.reply({
          content: 'The saved review channel could not be found. Set it again with `/setreviewchannel`.',
          flags: 64,
        });
        return;
      }

      const draft = reviewDrafts.get(interaction.user.id);
const stars = draft?.stars || 5;
const comment = interaction.fields.getTextInputValue('review_comment');

const submittedDate = `<t:${Math.floor(Date.now() / 1000)}:D>`;
const displayName =
  interaction.member?.displayName ||
  interaction.user.globalName ||
  interaction.user.username;

const reviewEmbed = new EmbedBuilder()
  .setColor('#2CEAE7')
  .setAuthor({
  name: 'New Review! 🤍',
  iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
})
  .setTitle(displayName)
  .addFields(
    {
      name: 'Comment',
      value: comment,
      inline: false,
    },
    {
      name: 'Rating',
      value: `${'⭐'.repeat(stars)} (${stars}/5)`,
      inline: true,
    },
    {
      name: 'Reviewed',
      value: submittedDate,
      inline: true,
    }
  )
  .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
  .setFooter({
    text: 'TophyProject Reviews',
    iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }),
  })
  .setTimestamp();

const reviewRow = new ActionRowBuilder().addComponents(
  new ButtonBuilder()
    .setCustomId('review_open')
    .setLabel('Leave a Review')
    .setEmoji('TP')
    .setStyle(ButtonStyle.Primary)
);

await reviewChannel.send({
  embeds: [reviewEmbed],
  components: [reviewRow],
});

reviewDrafts.delete(interaction.user.id);

await interaction.reply({
  content: 'Your review has been submitted. Thank you!',
  flags: 64,
});
return;
    }
  },
};

async function handleTicketOpen(interaction) {
  const settings = readSettings();
  const categoryId = settings.ticketCategoryId || null;
  const supportRoleId = settings.supportRoleId || null;

  const existing = interaction.guild.channels.cache.find(
    channel =>
      channel.name === `ticket-${interaction.user.username.toLowerCase().replace(/[^a-z0-9]/g, '-')}` &&
      channel.type === ChannelType.GuildText
  );

  if (existing) {
    await interaction.reply({ content: `You already have an open ticket: ${existing}`, flags: 64 });
    return;
  }

  const overwrites = [
    {
      id: interaction.guild.roles.everyone.id,
      deny: [PermissionFlagsBits.ViewChannel],
    },
    {
      id: interaction.user.id,
      allow: [
        PermissionFlagsBits.ViewChannel,
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.ReadMessageHistory,
      ],
    },
    {
      id: interaction.client.user.id,
      allow: [
        PermissionFlagsBits.ViewChannel,
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.ManageChannels,
        PermissionFlagsBits.ReadMessageHistory,
      ],
    },
  ];

  if (supportRoleId) {
    overwrites.push({
      id: supportRoleId,
      allow: [
        PermissionFlagsBits.ViewChannel,
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.ReadMessageHistory,
      ],
    });
  }

  const ticketChannel = await interaction.guild.channels.create({
    name: `ticket-${interaction.user.username.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
    type: ChannelType.GuildText,
    parent: categoryId,
    permissionOverwrites: overwrites,
    topic: `Ticket for ${interaction.user.tag} | ${interaction.user.id}`,
  });

  const closeRow = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('ticket_close')
      .setLabel('Close Ticket')
      .setStyle(ButtonStyle.Danger)
  );

  const embed = new EmbedBuilder()
    .setTitle('Support Ticket Opened')
    .setDescription([
      `${interaction.user}, your ticket has been created.`,
      'Please describe your issue and a staff member will assist you soon.'
    ].join('\n'))
    .setColor(readSettings().embedColor)
    .setFooter({ text: 'TophyProject Tickets' })
    .setTimestamp();

  await ticketChannel.send({ content: supportRoleId ? `<@&${supportRoleId}>` : interaction.user.toString(), embeds: [embed], components: [closeRow] });
  await interaction.reply({ content: `Your ticket has been created: ${ticketChannel}`, flags: 64 });
}
