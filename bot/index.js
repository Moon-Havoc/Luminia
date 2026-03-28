require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const express = require('express');
const cors = require('cors');
const Database = require('./database');
const Commands = require('./commands');
const crypto = require('crypto');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

client.commands = new Collection();
const prefix = '!';

client.once('ready', () => {
    console.log(`✅ Logged in as ${client.user.tag}!`);
    console.log(`Prefix: ${prefix}`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (Commands[commandName]) {
        try {
            await Commands[commandName](message, args);
        } catch (error) {
            console.error(error);
            message.reply('❌ There was an error executing that command.');
        }
    }
});

client.on('guildMemberAdd', async member => {
    console.log(`New user joined: ${member.user.tag}`);
    // Check if user is blacklisted
    const Database = require('./database');
    const blacklist = await Database.getBlacklist(member.id);
    if (blacklist) {
        try {
            await member.send(`⚠️ You are blacklisted from this bot's services. Reason: ${blacklist.reason}`);
            await member.kick('Blacklisted user');
        } catch (e) {
            console.log('Could not message blacklisted user.');
        }
    }
});

// Express Server for Web Keys
const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.status(200).send('OK'));

const generateRandomString = (length) => {
    return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length).toUpperCase();
};

app.post('/api/generate-key', async (req, res) => {
    try {
        const key = `LUM_${generateRandomString(15)}`;
        const result = await Database.createKey(key, 'web', 24);
        res.status(200).json({ success: true, key: result.key, expiresAt: result.expiresAt });
    } catch (error) {
        console.error('Error generating key:', error);
        res.status(500).json({ success: false, message: 'Failed to generate key.' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 API Server running on port ${PORT}`);
});

// For local testing: if no token, warn but don't crash
const token = process.env.DISCORD_TOKEN;
if (token) {
    client.login(token).catch(err => {
        console.error('❌ Discord Login Failed:', err.message);
        console.log('💡 Note: The API server is still running.');
    });
} else {
    console.warn('⚠️ DISCORD_TOKEN not found in .env file. Bot will not start.');
}
