const { SlashCommandBuilder } = require('discord.js');
const { updateSettings } = require('../utils/storage');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setcolor')
    .setDescription('Set the default embed color for ticket and review panels.')
    .addStringOption(option =>
      option
        .setName('hex')
        .setDescription('Hex color like #5865F2')
        .setRequired(true)
    ),

  async execute(interaction) {
    const hex = interaction.options.getString('hex').trim();
    const isValid = /^#?[0-9A-Fa-f]{6}$/.test(hex);

    if (!isValid) {
      await interaction.reply({ content: 'Please provide a valid 6-digit hex color, like `#5865F2`.', ephemeral: true });
      return;
    }

    const normalized = hex.startsWith('#') ? hex : `#${hex}`;
    updateSettings({ embedColor: normalized });
    await interaction.reply({ content: `Embed color updated to \

display: ${normalized}`, ephemeral: true });
  },
};
