const { SlashCommandBuilder, ChannelType } = require('discord.js');
const { updateSettings } = require('../utils/storage');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setticketcategory')
    .setDescription('Set the category where new tickets are created.')
    .addChannelOption(option =>
      option
        .setName('category')
        .setDescription('Ticket category')
        .addChannelTypes(ChannelType.GuildCategory)
        .setRequired(true)
    ),

  async execute(interaction) {
    const category = interaction.options.getChannel('category');
    updateSettings({ ticketCategoryId: category.id });
    await interaction.reply({ content: `Ticket category set to **${category.name}**.`, ephemeral: true });
  },
};
