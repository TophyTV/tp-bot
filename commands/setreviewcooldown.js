const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

const settingsPath = path.join(__dirname, '..', 'data', 'settings.json');

function readSettings() {
  if (!fs.existsSync(settingsPath)) {
    return {};
  }
  return JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
}

function writeSettings(settings) {
  fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setreviewcooldown')
    .setDescription('Enable or disable the review cooldown and set its hours.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addBooleanOption(option =>
      option
        .setName('enabled')
        .setDescription('Turn the review cooldown on or off')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option
        .setName('hours')
        .setDescription('How many hours users must wait before leaving another review')
        .setMinValue(1)
        .setMaxValue(168)
        .setRequired(false)
    ),

  async execute(interaction) {
    const enabled = interaction.options.getBoolean('enabled');
    const hours = interaction.options.getInteger('hours');

    const settings = readSettings();
    settings.reviewCooldownEnabled = enabled;

    if (hours !== null) {
      settings.reviewCooldownHours = hours;
    } else if (settings.reviewCooldownHours == null) {
      settings.reviewCooldownHours = 5;
    }

    writeSettings(settings);

    await interaction.reply({
      content: `Review cooldown ${enabled ? 'enabled' : 'disabled'}${enabled ? ` at ${settings.reviewCooldownHours} hour(s).` : '.'}`,
      flags: 64,
    });
  },
};