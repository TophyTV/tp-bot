const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Make the bot send a message.')
    .addStringOption(option =>
      option.setName('message').setDescription('Text to send').setRequired(true)
    )
    .addChannelOption(option =>
      option.setName('channel').setDescription('Target channel').setRequired(false)
    ),

  async execute(interaction) {
    const message = interaction.options.getString('message');
    const channel = interaction.options.getChannel('channel') || interaction.channel;

    await channel.send({ content: message });
    await interaction.reply({ content: `Message sent in ${channel}.`, flags: 64 });
  },
};
