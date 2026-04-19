const { SlashCommandBuilder } = require('discord.js');
const { updateSettings } = require('../utils/storage');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setreviewchannel')
    .setDescription('Set the channel where review embeds are sent.')
    .addChannelOption(option =>
      option
        .setName('channel')
        .setDescription('Review output channel')
        .setRequired(true)
    ),

  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');
    updateSettings({ reviewChannelId: channel.id });
    await interaction.reply({ content: `Review channel set to ${channel}.`, flags: 64 });
  },
};
