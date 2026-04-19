const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { readSettings } = require('../utils/storage');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('embed')
    .setDescription('Post a simple custom embed.')
    .addStringOption(option =>
      option.setName('title').setDescription('Embed title').setRequired(true)
    )
    .addStringOption(option =>
      option.setName('description').setDescription('Embed description').setRequired(true)
    )
    .addChannelOption(option =>
      option.setName('channel').setDescription('Target channel').setRequired(false)
    ),

  async execute(interaction) {
    const settings = readSettings();
    const title = interaction.options.getString('title');
    const description = interaction.options.getString('description');
    const channel = interaction.options.getChannel('channel') || interaction.channel;

    const embed = new EmbedBuilder()
      .setTitle(title)
      .setDescription(description)
      .setColor(settings.embedColor)
      .setTimestamp();

    await channel.send({ embeds: [embed] });
    await interaction.reply({ content: `Embed posted in ${channel}.`, flags: 64 });
  },
};
