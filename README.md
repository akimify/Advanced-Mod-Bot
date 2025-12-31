# Discord Advanced Moderation Bot 🛡️

A powerful and feature-rich Discord moderation bot built with Discord.js v14, designed to help server administrators maintain order and create a safe community environment.

## ✨ Features

### 🔨 Moderation Commands
- **Kick** - Remove members from the server
- **Ban** - Permanently ban members
- **Timeout** - Temporarily mute members
- **Warn** - Issue formal warnings to users
- **Clear** - Bulk delete messages (1-100)

### 🤖 Automated Features
- **Auto-Moderation** - Automatically detects and removes messages containing blacklisted words
- **Auto-Role** - Automatically assigns a role to new members
- **Welcome Messages** - Sends customizable welcome messages with member count
- **Audit Logging** - Tracks all moderation actions in a dedicated log channel

### 📊 Utility Commands
- **User Info** - Display detailed information about server members

## 📋 Prerequisites

- Node.js v16.9.0 or higher
- A Discord Bot Token ([Discord Developer Portal](https://discord.com/developers/applications))
- Basic understanding of Discord permissions

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/discord-moderation-bot.git
   cd discord-moderation-bot
   ```

2. **Install dependencies**
   ```bash
   npm install discord.js dotenv
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   DISCORD_TOKEN=your_bot_token_here
   CLIENT_ID=your_application_id_here
   ```

4. **Configure bot settings**
   
   Edit these variables in `index.js`:
   ```javascript
   const LOG_CHANNEL_NAME = 'mod-logs';     // Channel for audit logs
   const AUTO_ROLE_NAME = 'Member';         // Role given to new joiners
   const WELCOME_CHANNEL = 'general';       // Channel for welcome messages
   ```

5. **Run the bot**
   ```bash
   node index.js
   ```

## 🔧 Setup Guide

### Bot Permissions

Your bot needs the following permissions:
- Kick Members
- Ban Members
- Manage Roles
- Manage Messages
- Moderate Members (for timeouts)
- Send Messages
- Embed Links
- Read Message History

### Required Channels

Create these channels in your Discord server:
- `#mod-logs` - For moderation action logging
- `#general` - For welcome messages (or use your existing general channel)

### Required Roles

Create a role named `Member` that will be automatically assigned to new members.

## 📝 Command Usage

All commands are slash commands. Type `/` in Discord to see available commands.

### `/kick`
Kick a member from the server.
```
/kick user:@Username reason:Spamming
```

### `/ban`
Ban a member from the server.
```
/ban user:@Username reason:Breaking rules
```

### `/timeout`
Temporarily mute a member.
```
/timeout user:@Username minutes:30
```

### `/warn`
Issue a formal warning to a user.
```
/warn user:@Username reason:Inappropriate language
```

### `/userinfo`
Display information about a user.
```
/userinfo user:@Username
```

### `/clear`
Bulk delete messages (1-100).
```
/clear amount:50
```

## 🎨 Customization

### Auto-Moderation Keywords

Edit the blacklisted words in `index.js`:
```javascript
const blacklistedWords = ['scam', 'badword', 'free nitro', 'steam gift'];
```

### Bot Status

Customize the bot's activity status:
```javascript
client.user.setActivity('over the server 🛡️', { type: ActivityType.Watching });
```

### Embed Colors

Modify embed colors throughout the code:
- `0x00FF00` - Green (welcome)
- `0xFF0000` - Red (bans, auto-mod)
- `0xFFA500` - Orange (kicks)
- `0xFFFF00` - Yellow (timeouts)
- `0xFFCC00` - Amber (warnings)
- `0x0099FF` - Blue (info)

## 📦 Data Storage

Currently, the bot uses in-memory storage for warnings. For production environments, consider implementing:
- MongoDB
- SQLite
- JSON file storage
- PostgreSQL/MySQL

## 🛠️ Troubleshooting

### Bot not responding to commands
- Ensure the bot has proper permissions
- Verify that slash commands are registered (check console on startup)
- Make sure the bot is online and has the correct intents

### Auto-role not working
- Check that the bot's role is higher than the role being assigned
- Verify the role name matches exactly in the code

### Welcome messages not sending
- Confirm the welcome channel exists and has the correct name
- Ensure the bot has permission to send messages in that channel

## ⚠️ Important Notes

- The bot requires the `MESSAGE_CONTENT` intent to read message text for auto-moderation
- Warnings are stored in memory and will be lost when the bot restarts
- For production use, implement a proper database solution
- Always test commands in a development server first

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Useful Links

- [Discord.js Documentation](https://discord.js.org/)
- [Discord Developer Portal](https://discord.com/developers/docs)
- [Discord.js Guide](https://discordjs.guide/)

## 💬 Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

Made with ❤️ for Discord communities
