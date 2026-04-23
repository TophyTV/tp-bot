const {
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');
const { readSettings } = require('./storage');

function buildTicketPanel({ title, description }) {
  const settings = readSettings();

  const embed = new EmbedBuilder()
    .setTitle(`**${title}**`)
    .setDescription(`${description}\n\nSelect a category below to open a ticket.`)
    .setColor(settings.embedColor)
    .setFooter({ text: 'TophyProjects | Tickets' });

  const row = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('ticket_category_select')
      .setPlaceholder('🎟️ Choose a ticket category')
      .addOptions([
        {
          label: 'General Support',
          value: 'general_support',
          description: 'Questions, help, or general issues',
          emoji: '🎫',
        },
        {
          label: 'Player Report',
          value: 'player_report',
          description: 'Report a player or issue',
          emoji: '⚠️',
        },
        {
          label: 'Purchase Support',
          value: 'purchase_support',
          description: 'Billing, purchases, or packages',
          emoji: '💳',
        },
        {
          label: 'Staff Report',
          value: 'staff_report',
          description: 'Report a staff-related issue',
          emoji: '📋',
        },
      ])
  );

  return { embed, row };
}

function buildReviewPanel({ title, description, buttonLabel }) {
  const settings = readSettings();

  const embed = new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor(settings.embedColor)
    .setFooter({ text: 'TophyProject Reviews' })
    .setTimestamp();

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('review_open')
      .setLabel(buttonLabel)
      .setStyle(ButtonStyle.Success)
  );

  return { embed, row };
}

module.exports = {
  buildTicketPanel,
  buildReviewPanel,
};
