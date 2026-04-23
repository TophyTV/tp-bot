const { SlashCommandBuilder } = require('discord.js');
const { buildTicketPanel } = require('../utils/panels');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticketpanel')
    .setDescription('Post a customizable ticket panel.')
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
    .addChannelOption(option =>
      option
        .setName('channel')
        .setDescription('Where to post the panel')
        .setRequired(false)
    ),

  async execute(interaction) {
    const title = interaction.options.getString('title');
    const description = interaction.options.getString('description');
    const channel = interaction.options.getChannel('channel') || interaction.channel;

    const { embed, row } = buildTicketPanel({ title, description });

    await channel.send({ embeds: [embed], components: [row] });
    await interaction.reply({ content: `Ticket panel posted in ${channel}.`, flags: 64 });
  },
};