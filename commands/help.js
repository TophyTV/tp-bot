const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { readSettings } = require('../utils/storage');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Show the bot command list.'),

  async execute(interaction) {
    const settings = readSettings();

    const embed = new EmbedBuilder()
      .setTitle('TophyProject Bot Commands')
      .setColor(settings.embedColor)
      .setDescription([
        '`/ticketpanel` - Post a ticket panel',
        '`/reviewpanel` - Post a review panel',
        '`/setticketcategory` - Set ticket category',
        '`/setsupportrole` - Set ticket support role',
        '`/setreviewchannel` - Set review output channel',
        '`/setcolor` - Change embed color',
        '`/closeticket` - Close the current ticket',
        '`/adduser` - Add a user to a ticket',
        '`/removeuser` - Remove a user from a ticket',
        '`/embed` - Post a custom embed',
        '`/say` - Send a plain message',
        '`/ping` - Check if the bot is online'
      ].join('\n'))
      .setFooter({ text: 'TophyProject Reviews' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed], flags: 64 });
  },
};
