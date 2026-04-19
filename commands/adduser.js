const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('adduser')
    .setDescription('Add a user to the current ticket channel.')
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('User to add')
        .setRequired(true)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser('user');

    await interaction.channel.permissionOverwrites.edit(user.id, {
      ViewChannel: true,
      SendMessages: true,
      ReadMessageHistory: true,
    });

    await interaction.reply({ content: `${user} has been added to this ticket.` });
  },
};
