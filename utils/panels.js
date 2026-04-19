const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');
const { readSettings } = require('./storage');

function buildTicketPanel({ title, description, buttonLabel }) {
  const settings = readSettings();

  const embed = new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor(settings.embedColor)
    .setFooter({ text: 'TophyProject Tickets' })
    .setTimestamp();

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('ticket_open')
      .setLabel(buttonLabel)
      .setStyle(ButtonStyle.Primary)
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
