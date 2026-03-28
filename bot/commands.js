const Database = require('./database');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');

const Commands = {
    // Licensing
    'prem-gen': async (message, args) => {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return message.reply('❌ No permission.');
        const [userMention, robloxUser] = args;
        const targetId = userMention?.replace(/[<@!>]/g, '');
        if (!targetId || !robloxUser) return message.reply('Usage: `!prem-gen @user robloxuser`');
        
        await Database.whitelistUser(targetId, robloxUser, 'PREM_KEY', 1);
        message.reply(`✅ Premium generated for <@${targetId}> (Roblox: ${robloxUser})`);
    },

    'gen-key': async (message, args) => {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return message.reply('❌ No permission.');
        const [userMention, robloxUser] = args;
        const targetId = userMention?.replace(/[<@!>]/g, '');
        if (!targetId || !robloxUser) return message.reply('Usage: `!gen-key @user robloxuser`');
        
        await Database.whitelistUser(targetId, robloxUser, 'KEY_123', 0);
        message.reply(`✅ Key generated for <@${targetId}> (Roblox: ${robloxUser})`);
    },

    'reset_hwid': async (message, args) => {
        const targetId = message.author.id;
        await Database.resetHWID(targetId);
        message.reply('✅ HWID reset successfully.');
    },

    'revoke_key': async (message, args) => {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return message.reply('❌ No permission.');
        const [userMention, key] = args;
        const targetId = userMention?.replace(/[<@!>]/g, '');
        if (!targetId || !key) return message.reply('Usage: `!revoke_key @user key`');
        
        const count = await Database.revokeKey(targetId, key);
        message.reply(count > 0 ? `✅ Key revoked for <@${targetId}>.` : '❌ Key not found.');
    },

    'revoke_prem': async (message, args) => {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return message.reply('❌ No permission.');
        const [userMention, key] = args;
        const targetId = userMention?.replace(/[<@!>]/g, '');
        if (!targetId || !key) return message.reply('Usage: `!revoke_prem @user key`');
        
        await Database.whitelistUser(targetId, null, null, 0);
        message.reply(`✅ Premium revoked for <@${targetId}>.`);
    },

    // Blacklist
    'blacklists': async (message, args) => {
        const targetId = args[0]?.replace(/[<@!>]/g, '');
        if (!targetId) return message.reply('Usage: `!blacklists @user`');
        
        const blacklist = await Database.getBlacklist(targetId);
        if (blacklist) {
            message.reply(`⚠️ User <@${targetId}> is blacklisted for: ${blacklist.reason}`);
        } else {
            message.reply(`✅ User <@${targetId}> is not blacklisted.`);
        }
    },

    'unblacklist': async (message, args) => {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return message.reply('❌ No permission.');
        const targetId = args[0]?.replace(/[<@!>]/g, '');
        if (!targetId) return message.reply('Usage: `!unblacklist @user`');
        
        await Database.unblacklistUser(targetId);
        message.reply(`✅ User <@${targetId}> unblacklisted.`);
    },

    // Moderation
    'ban': async (message, args) => {
        if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return message.reply('❌ No permission.');
        const targetMember = message.mentions.members.first();
        const reason = args.slice(1).join(' ') || 'No reason provided';
        if (!targetMember) return message.reply('Usage: `!ban @user reason`');
        
        await targetMember.ban({ reason });
        message.reply(`🛑 Banned ${targetMember.user.tag} for: ${reason}`);
    },

    'kick': async (message, args) => {
        if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) return message.reply('❌ No permission.');
        const targetMember = message.mentions.members.first();
        const reason = args.slice(1).join(' ') || 'No reason provided';
        if (!targetMember) return message.reply('Usage: `!kick @user reason`');
        
        await targetMember.kick(reason);
        message.reply(`👢 Kicked ${targetMember.user.tag} for: ${reason}`);
    },

    'mute': async (message, args) => {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) return message.reply('❌ No permission.');
        const targetMember = message.mentions.members.first();
        const durationStr = args[1];
        const reason = args.slice(2).join(' ') || 'No reason provided';
        if (!targetMember || !durationStr) return message.reply('Usage: `!mute @user duration reason` (duration in ms, e.g. 60000)');
        
        const duration = parseInt(durationStr);
        await targetMember.timeout(duration, reason);
        message.reply(`🔇 Muted ${targetMember.user.tag} for ${duration / 1000}s. Reason: ${reason}`);
    },

    'unmute': async (message, args) => {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) return message.reply('❌ No permission.');
        const targetMember = message.mentions.members.first();
        if (!targetMember) return message.reply('Usage: `!unmute @user`');
        
        await targetMember.timeout(null);
        message.reply(`🔊 Unmuted ${targetMember.user.tag}.`);
    },

    'unban': async (message, args) => {
        if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return message.reply('❌ No permission.');
        const targetId = args[0];
        if (!targetId) return message.reply('Usage: `!unban userId`');
        
        await message.guild.members.unban(targetId);
        message.reply(`✅ Unbanned user ID ${targetId}.`);
    },

    'role': async (message, args) => {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) return message.reply('❌ No permission.');
        const targetMember = message.mentions.members.first();
        const roleMention = message.mentions.roles.first();
        if (!targetMember || !roleMention) return message.reply('Usage: `!role @user @role`');
        
        await targetMember.roles.add(roleMention);
        message.reply(`✅ Added role ${roleMention.name} to ${targetMember.user.tag}.`);
    }
};

module.exports = Commands;
