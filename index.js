// index.js - Advanced Moderation Bot (English Version)

/**
 * Required Dependencies:
 * npm install discord.js dotenv
 */
const { 
    Client, 
    GatewayIntentBits, 
    Partials, 
    EmbedBuilder, 
    PermissionsBitField, 
    REST, 
    Routes,
    ActivityType
} = require('discord.js');
require('dotenv').config();

// --- Configuration ---
const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID; // Your Bot's Application ID
const LOG_CHANNEL_NAME = 'mod-logs';     // Channel for audit logs
const AUTO_ROLE_NAME = 'Member';         // Role given to new joiners
const WELCOME_CHANNEL = 'general';       // Channel for welcome messages

// --- In-Memory Database (For demonstration) ---
// In production, consider using MongoDB, SQLite, or JSON files.
const warningsMap = new Map(); // Structure: { userId: [ { reason, moderator, date } ] }

// --- Client Initialization ---
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,       // Required for Auto-Role & Welcome
        GatewayIntentBits.GuildMessages,      // Required for Auto-Mod
        GatewayIntentBits.MessageContent,     // Required to read message text
        GatewayIntentBits.GuildPresences
    ],
    partials: [Partials.Channel, Partials.Message, Partials.User]
});

// --- Slash Command Definitions ---
const commands = [
    {
        name: 'kick',
        description: 'Kick a member from the server.',
        options: [
            {
                name: 'user',
                description: 'The user to kick',
                type: 6, // USER type
                required: true,
            },
            {
                name: 'reason',
                description: 'Reason for kicking',
                type: 3, // STRING type
                required: false,
            },
        ],
    },
    {
        name: 'ban',
        description: 'Ban a member from the server.',
        options: [
            {
                name: 'user',
                description: 'The user to ban',
                type: 6,
                required: true,
            },
            {
                name: 'reason',
                description: 'Reason for banning',
                type: 3,
                required: false,
            },
        ],
    },
    {
        name: 'timeout',
        description: 'Timeout (mute) a member.',
        options: [
            {
                name: 'user',
                description: 'The user to timeout',
                type: 6,
                required: true,
            },
            {
                name: 'minutes',
                description: 'Duration in minutes',
                type: 4, // INTEGER
                required: true,
            },
        ],
    },
    {
        name: 'warn',
        description: 'Issue a formal warning to a user.',
        options: [
            {
                name: 'user',
                description: 'The user to warn',
                type: 6,
                required: true,
            },
            {
                name: 'reason',
                description: 'Reason for the warning',
                type: 3,
                required: true,
            },
        ],
    },
    {
        name: 'userinfo',
        description: 'Display information about a user.',
        options: [
            {
                name: 'user',
                description: 'The user to inspect',
                type: 6,
                required: false,
            },
        ],
    },
    {
        name: 'clear',
        description: 'Bulk delete messages.',
        options: [
            {
                name: 'amount',
                description: 'Number of messages to delete (1-100)',
                type: 4,
                required: true,
            }
        ]
    }
];

// --- Helper: Send Log Embed ---
async function sendLog(guild, embed) {
    const channel = guild.channels.cache.find(c => c.name === LOG_CHANNEL_NAME);
    if (channel) {
        await channel.send({ embeds: [embed] });
    } else {
        console.warn(`[Log System] Channel '${LOG_CHANNEL_NAME}' not found.`);
    }
}

// --- Event: Client Ready ---
client.once('ready', async () => {
    console.log(`✅ [System] Logged in as ${client.user.tag}`);
    client.user.setActivity('over the server 🛡️', { type: ActivityType.Watching });

    // Register Slash Commands Globally
    const rest = new REST({ version: '10' }).setToken(TOKEN);
    try {
        console.log('🔄 [System] Refreshing application (/) commands...');
        await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            { body: commands },
        );
        console.log('✨ [System] Successfully registered application commands.');
    } catch (error) {
        console.error('[Error] Failed to register commands:', error);
    }
});

// --- Event: Guild Member Add (Welcome & Auto-Role) ---
client.on('guildMemberAdd', async member => {
    console.log(`[Join] ${member.user.tag} joined the guild.`);

    // 1. Auto Role
    const role = member.guild.roles.cache.find(r => r.name === AUTO_ROLE_NAME);
    if (role) {
        try {
            await member.roles.add(role);
            console.log(`[AutoRole] Assigned '${role.name}' to ${member.user.tag}`);
        } catch (err) {
            console.error(`[AutoRole Error] Missing permissions to assign role: ${err.message}`);
        }
    }

    // 2. Welcome Message
    const channel = member.guild.channels.cache.find(ch => ch.name === WELCOME_CHANNEL);
    if (channel) {
        const welcomeEmbed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setTitle(`👋 Welcome to ${member.guild.name}!`)
            .setDescription(`Hello ${member}, please make sure to read the rules.\nYou are member #${member.guild.memberCount}.`)
            .setThumbnail(member.user.displayAvatarURL())
            .setTimestamp();
        
        channel.send({ embeds: [welcomeEmbed] });
    }
});

// --- Event: Message Create (Auto-Mod) ---
client.on('messageCreate', async message => {
    if (message.author.bot) return;

    // Basic Anti-Bad-Word System
    const blacklistedWords = ['scam', 'badword', 'free nitro', 'steam gift']; 
    
    const content = message.content.toLowerCase();
    const foundWord = blacklistedWords.find(word => content.includes(word));

    if (foundWord) {
        try {
            await message.delete();
            
            // Temporary warning message
            const warningMsg = await message.channel.send(`🚫 ${message.author}, that language is not allowed here.`);
            setTimeout(() => warningMsg.delete().catch(() => {}), 5000);

            // Log the incident
            const logEmbed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('🛡️ Auto-Mod Action')
                .addFields(
                    { name: 'User', value: `${message.author.tag}`, inline: true },
                    { name: 'Channel', value: `${message.channel}`, inline: true },
                    { name: 'Trigger Word', value: `||${foundWord}||`, inline: true },
                    { name: 'Original Message', value: `||${message.content}||` }
                )
                .setTimestamp();
            
            sendLog(message.guild, logEmbed);
        } catch (err) {
            console.error(`[AutoMod Error] ${err.message}`);
        }
    }
});

// --- Event: Interaction Create (Command Handling) ---
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName, options, user, guild } = interaction;
    const executor = interaction.member;

    // --- Command: Kick ---
    if (commandName === 'kick') {
        if (!executor.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            return interaction.reply({ content: '❌ You do not have permission to kick members.', ephemeral: true });
        }

        const targetUser = options.getUser('user');
        const reason = options.getString('reason') || 'No reason provided';
        
        try {
            const targetMember = await guild.members.fetch(targetUser.id);
            if (!targetMember.kickable) {
                return interaction.reply({ content: '❌ I cannot kick this user (Role hierarchy or missing permissions).', ephemeral: true });
            }

            await targetMember.kick(reason);

            const embed = new EmbedBuilder()
                .setColor(0xFFA500)
                .setDescription(`👢 **${targetUser.tag}** has been kicked.\n📝 Reason: ${reason}`);
            await interaction.reply({ embeds: [embed] });

            const logEmbed = new EmbedBuilder()
                .setColor(0xFFA500)
                .setTitle('👢 Member Kicked')
                .addFields(
                    { name: 'Executor', value: user.tag, inline: true },
                    { name: 'Target', value: targetUser.tag, inline: true },
                    { name: 'Reason', value: reason }
                )
                .setTimestamp();
            sendLog(guild, logEmbed);

        } catch (err) {
            await interaction.reply({ content: '❌ User not found or not in server.', ephemeral: true });
        }
    }

    // --- Command: Ban ---
    else if (commandName === 'ban') {
        if (!executor.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return interaction.reply({ content: '❌ You do not have permission to ban members.', ephemeral: true });
        }

        const targetUser = options.getUser('user');
        const reason = options.getString('reason') || 'No reason provided';

        try {
            await guild.members.ban(targetUser, { reason });
            
            const embed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setDescription(`🔨 **${targetUser.tag}** has been banned.\n📝 Reason: ${reason}`);
            await interaction.reply({ embeds: [embed] });

            const logEmbed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('🔨 Member Banned')
                .addFields(
                    { name: 'Executor', value: user.tag, inline: true },
                    { name: 'Target', value: targetUser.tag, inline: true },
                    { name: 'Reason', value: reason }
                )
                .setTimestamp();
            sendLog(guild, logEmbed);
        } catch (e) {
            await interaction.reply({ content: '❌ Failed to ban user.', ephemeral: true });
        }
    }

    // --- Command: Timeout ---
    else if (commandName === 'timeout') {
        if (!executor.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return interaction.reply({ content: '❌ You do not have permission to timeout members.', ephemeral: true });
        }

        const targetUser = options.getUser('user');
        const minutes = options.getInteger('minutes');
        const targetMember = await guild.members.fetch(targetUser.id);

        try {
            await targetMember.timeout(minutes * 60 * 1000, 'Moderator Action');
            
            await interaction.reply(`⏳ **${targetUser.tag}** has been timed out for ${minutes} minutes.`);
            
            const logEmbed = new EmbedBuilder()
                .setColor(0xFFFF00)
                .setTitle('⏳ Member Timed Out')
                .setDescription(`${targetUser.tag} received a ${minutes} minute timeout.`)
                .setFooter({ text: `Executor: ${user.tag}` })
                .setTimestamp();
            sendLog(guild, logEmbed);
        } catch (e) {
            await interaction.reply({ content: '❌ Failed to timeout user.', ephemeral: true });
        }
    }

    // --- Command: Warn ---
    else if (commandName === 'warn') {
        if (!executor.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return interaction.reply({ content: '❌ You do not have permission to warn members.', ephemeral: true });
        }

        const targetUser = options.getUser('user');
        const reason = options.getString('reason');

        // Store in memory
        if (!warningsMap.has(targetUser.id)) {
            warningsMap.set(targetUser.id, []);
        }
        warningsMap.get(targetUser.id).push({ reason, moderator: user.tag, date: new Date() });
        const count = warningsMap.get(targetUser.id).length;

        const embed = new EmbedBuilder()
            .setColor(0xFFCC00)
            .setTitle('⚠️ Warning Issued')
            .setDescription(`**Target**: ${targetUser}\n**Reason**: ${reason}\n**Total Warnings**: ${count}`);
        
        await interaction.reply({ embeds: [embed] });

        // DM the user
        try {
            await targetUser.send(`⚠️ You received a warning in **${guild.name}**: ${reason}`);
        } catch (err) {
            // User likely has DMs closed
        }
    }

    // --- Command: User Info ---
    else if (commandName === 'userinfo') {
        const targetUser = options.getUser('user') || user;
        const targetMember = await guild.members.fetch(targetUser.id);
        
        const joinDate = targetMember.joinedAt.toLocaleDateString('en-US');
        const createDate = targetUser.createdAt.toLocaleDateString('en-US');
        
        const roles = targetMember.roles.cache
            .filter(r => r.name !== '@everyone')
            .map(r => `<@&${r.id}>`)
            .join(' ') || 'None';

        const infoEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setAuthor({ name: targetUser.tag, iconURL: targetUser.displayAvatarURL() })
            .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: '🆔 User ID', value: targetUser.id, inline: true },
                { name: '📅 Created', value: createDate, inline: true },
                { name: '📥 Joined', value: joinDate, inline: true },
                { name: '🎭 Roles', value: roles }
            )
            .setFooter({ text: `Requested by ${user.tag}` })
            .setTimestamp();

        await interaction.reply({ embeds: [infoEmbed] });
    }

    // --- Command: Clear ---
    else if (commandName === 'clear') {
        if (!executor.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return interaction.reply({ content: '❌ Missing permissions.', ephemeral: true });
        }

        const amount = options.getInteger('amount');
        if (amount < 1 || amount > 100) {
            return interaction.reply({ content: '❌ Please specify a number between 1 and 100.', ephemeral: true });
        }

        await interaction.channel.bulkDelete(amount, true);
        const msg = await interaction.reply({ content: `🧹 Deleted ${amount} messages.`, fetchReply: true });
        setTimeout(() => msg.delete().catch(() => {}), 3000);
    }
});

// --- Anti-Crash Strategy ---
// Prevents the bot from dying due to unhandled errors
process.on('unhandledRejection', (reason, promise) => {
    console.error('[Anti-Crash] Unhandled Rejection:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('[Anti-Crash] Uncaught Exception:', err);
});

// --- Login ---
client.login(TOKEN);
