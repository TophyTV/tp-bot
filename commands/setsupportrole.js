const { SlashCommandBuilder } = require('discord.js');
const { updateSettings } = require('../utils/storage');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setsupportrole')
    .setDescription('Set the support role that can see all tickets.')
    .addRoleOption(option =>
      option
        .setName('role')
        .setDescription('Support staff role')
        .setRequired(true)
    ),

  async execute(interaction) {
    const role = interaction.options.getRole('role');
    updateSettings({ supportRoleId: role.id });
    await interaction.reply({ content: `Support role set to ${role}.`, ephemeral: true });
  },
};
