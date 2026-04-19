# TophyProject Discord Bot

A starter Discord bot built with **Node.js** and **discord.js v14**.

## Features
- Customizable ticket panel
- Private ticket channel creation
- Close ticket button
- Add/remove users in tickets
- Customizable review panel
- 1-5 star review flow
- Modal-based review comments
- Review embed with profile, stars, comment, and **TophyProject Reviews** footer
- Custom embed and custom say commands
- Easy JSON settings file for channel/category/role storage

## Requirements
- Node.js 18.17 or newer
- A Discord application and bot created in the Discord Developer Portal
- A test server where you can invite the bot

## Setup
1. Download or clone this project.
2. Open the folder in your terminal.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Copy `.env.example` to `.env`
5. Fill in:
   - `DISCORD_TOKEN`
   - `CLIENT_ID`
   - `GUILD_ID`
6. Deploy commands:
   ```bash
   npm run deploy
   ```
7. Start the bot:
   ```bash
   npm start
   ```

## Bot Invite
When you generate the invite link in the Discord Developer Portal, include:
- `bot`
- `applications.commands`

Recommended bot permissions:
- View Channels
- Send Messages
- Manage Channels
- Manage Roles (optional, only if you expand later)
- Read Message History
- Embed Links
- Use Slash Commands

## First-time In-Server Setup
Run these commands:

```text
/setticketcategory
/setsupportrole
/setreviewchannel
/setcolor
```

Then post your panels:

```text
/ticketpanel
/reviewpanel
```

## Commands
- `/ticketpanel` - Post a ticket panel
- `/reviewpanel` - Post a review panel
- `/setticketcategory` - Set the ticket category
- `/setsupportrole` - Set the support role for tickets
- `/setreviewchannel` - Set where completed reviews are posted
- `/setcolor` - Set default embed color
- `/closeticket` - Close the current ticket channel
- `/adduser` - Add a user to the current ticket
- `/removeuser` - Remove a user from the current ticket
- `/embed` - Post a custom embed
- `/say` - Make the bot send a message
- `/ping` - Check if the bot is online
- `/help` - Show all commands

## How the Review System Works
1. An admin runs `/reviewpanel`
2. The bot posts an embed with a **Leave Review** button
3. A user clicks the button
4. The bot shows a star selector
5. The bot opens a modal for the written review
6. The bot posts the final embed in the review channel

## How the Ticket System Works
1. An admin runs `/ticketpanel`
2. The bot posts an embed with an **Open Ticket** button
3. A user clicks the button
4. The bot creates a private ticket channel in your chosen category
5. The creator and support role can see it
6. The bot posts a close button inside the ticket

## Adding Your Own Commands Later
1. Create a new file in `commands/`, for example `example.js`
2. Use this template:

```js
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('example')
    .setDescription('Example custom command'),

  async execute(interaction) {
    await interaction.reply({ content: 'This is my custom command!', flags: 64 });
  },
};
```

3. Run:
   ```bash
   npm run deploy
   ```
4. Restart the bot:
   ```bash
   npm start
   ```

## Notes
- This starter project uses a JSON file instead of a database to stay simple.
- If you want transcripts, claim buttons, logging, cooldowns, or a web dashboard later, those can be added cleanly on top of this base.
