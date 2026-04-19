const { SlashCommandBuilder, ChannelType } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('closeticket')
    .setDescription('Close the current ticket channel.'),

  async execute(interaction) {
    if (interaction.channel.type !== ChannelType.GuildText) {
      await interaction.reply({ content: 'This command can only be used inside a ticket text channel.', flags: 64 });
      return;
    }

    await interaction.reply({ content: 'Closing ticket in 3 seconds...' });
    setTimeout(async () => {
      try {
        await interaction.channel.delete('Ticket closed by command');
      } catch (error) {
        console.error('Failed to delete ticket channel:', error);
      }
    }, 3000);
  },
};
