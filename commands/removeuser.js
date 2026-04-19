const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('removeuser')
    .setDescription('Remove a user from the current ticket channel.')
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('User to remove')
        .setRequired(true)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser('user');

    await interaction.channel.permissionOverwrites.delete(user.id);
    await interaction.reply({ content: `${user} has been removed from this ticket.` });
  },
};
