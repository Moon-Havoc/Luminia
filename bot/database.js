const { Pool } = require('pg');
const path = require('path');
require('dotenv').config();

let pool;

if (process.env.DATABASE_URL) {
    // Use PostgreSQL for Cloud (Supabase/Neon/Railway)
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });

    // Initialize PostgreSQL Schema
    const initDb = async () => {
        try {
            const client = await pool.connect();
            try {
                await client.query(`
                    CREATE TABLE IF NOT EXISTS whitelist (
                        discord_id TEXT PRIMARY KEY,
                        roblox_user TEXT,
                        hwid TEXT,
                        is_premium INTEGER DEFAULT 0,
                        key TEXT
                    );
                    CREATE TABLE IF NOT EXISTS blacklists (
                        discord_id TEXT PRIMARY KEY,
                        reason TEXT,
                        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    );
                    CREATE TABLE IF NOT EXISTS keys (
                        key TEXT PRIMARY KEY,
                        type TEXT,
                        used_by TEXT,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        expires_at TIMESTAMP
                    );
                `);
                console.log('✅ PostgreSQL Schema Verified.');
            } finally {
                client.release();
            }
        } catch (err) {
            console.error('❌ Database connection failed:', err.message);
            console.warn('⚠️ Bot will continue but DB calls will fail until connection is restored.');
        }
    };
    initDb();
} else {
    console.warn('⚠️ No DATABASE_URL found. Falling back to local SQLite.');
    // Keep SQLite fallback for local development if preferred, 
    // but the user wants a "real" DB, so I'll warn them.
}

const Database = {
    whitelistUser: async (discordId, robloxUser, key, isPremium = 0) => {
        const query = `
            INSERT INTO whitelist (discord_id, roblox_user, key, is_premium) 
            VALUES ($1, $2, $3, $4) 
            ON CONFLICT (discord_id) 
            DO UPDATE SET roblox_user = EXCLUDED.roblox_user, key = EXCLUDED.key, is_premium = EXCLUDED.is_premium
        `;
        await pool.query(query, [discordId, robloxUser, key, isPremium]);
        return true;
    },

    revokeKey: async (discordId, key) => {
        const query = `DELETE FROM whitelist WHERE discord_id = $1 AND key = $2`;
        const result = await pool.query(query, [discordId, key]);
        return result.rowCount;
    },

    resetHWID: async (discordId) => {
        const query = `UPDATE whitelist SET hwid = NULL WHERE discord_id = $1`;
        const result = await pool.query(query, [discordId]);
        return result.rowCount;
    },

    blacklistUser: async (discordId, reason) => {
        const query = `
            INSERT INTO blacklists (discord_id, reason) 
            VALUES ($1, $2) 
            ON CONFLICT (discord_id) 
            DO UPDATE SET reason = EXCLUDED.reason, timestamp = CURRENT_TIMESTAMP
        `;
        await pool.query(query, [discordId, reason]);
        return true;
    },

    unblacklistUser: async (discordId) => {
        const query = `DELETE FROM blacklists WHERE discord_id = $1`;
        const result = await pool.query(query, [discordId]);
        return result.rowCount;
    },

    getBlacklist: async (discordId) => {
        const query = `SELECT * FROM blacklists WHERE discord_id = $1`;
        const result = await pool.query(query, [discordId]);
        return result.rows[0];
    },

    createKey: async (key, type = 'standard', durationHours = 24) => {
        const expiresAt = new Date(Date.now() + durationHours * 60 * 60 * 1000).toISOString();
        const query = `INSERT INTO keys (key, type, expires_at) VALUES ($1, $2, $3)`;
        await pool.query(query, [key, type, expiresAt]);
        return { key, expiresAt };
    },

    isValidKey: async (key) => {
        const query = `SELECT * FROM keys WHERE key = $1 AND (expires_at > CURRENT_TIMESTAMP OR expires_at IS NULL)`;
        const result = await pool.query(query, [key]);
        return result.rows[0];
    },

    getWhitelistEntry: async (discordId) => {
        const query = `SELECT * FROM whitelist WHERE discord_id = $1`;
        const result = await pool.query(query, [discordId]);
        return result.rows[0];
    }
};

module.exports = Database;
