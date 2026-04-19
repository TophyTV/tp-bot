const { SlashCommandBuilder } = require('discord.js');
const { buildReviewPanel } = require('../utils/panels');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reviewpanel')
    .setDescription('Post a customizable review panel.')
    .addStringOption(option =>
      option
        .setName('title')
        .setDescription('Embed title')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('description')
        .setDescription('Embed description')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('button_label')
        .setDescription('Button label')
        .setRequired(false)
    )
    .addChannelOption(option =>
      option
        .setName('channel')
        .setDescription('Where to post the panel')
        .setRequired(false)
    ),

  async execute(interaction) {
    const title = interaction.options.getString('title');
    const description = interaction.options.getString('description');
    const buttonLabel = interaction.options.getString('button_label') || 'Leave Review';
    const channel = interaction.options.getChannel('channel') || interaction.channel;

    const { embed, row } = buildReviewPanel({ title, description, buttonLabel });

    await channel.send({ embeds: [embed], components: [row] });
    await interaction.reply({ content: `Review panel posted in ${channel}.`, flags: 64 });
  },
};
