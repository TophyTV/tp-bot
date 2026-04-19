const fs = require('node:fs');
const path = require('node:path');

const settingsPath = path.join(__dirname, '..', 'data', 'settings.json');

function readSettings() {
  try {
    const raw = fs.readFileSync(settingsPath, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    return {
      ticketCategoryId: '',
      supportRoleId: '',
      reviewChannelId: '',
      embedColor: '#5865F2',
    };
  }
}

function writeSettings(nextSettings) {
  fs.writeFileSync(settingsPath, JSON.stringify(nextSettings, null, 2), 'utf8');
}

function updateSettings(patch) {
  const current = readSettings();
  const next = { ...current, ...patch };
  writeSettings(next);
  return next;
}

module.exports = {
  readSettings,
  writeSettings,
  updateSettings,
};
