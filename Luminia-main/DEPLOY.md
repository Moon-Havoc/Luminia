# Luminia Deployment Guide

## Overview
| Service | What it hosts |
|---------|--------------|
| Railway | Discord bot + Express API |
| Railway | PostgreSQL database |
| Vercel  | React web frontend |

---

## Step 1 — Deploy the Bot on Railway

1. Go to [railway.app](https://railway.app) and open your project (or create a new one)
2. Click **New Service → GitHub Repo** and select `Moon-Havoc/Luminia`
3. When prompted for the root directory, set it to **`bot`**
4. Railway will auto-detect Node and use `node index.js` as the start command

---

## Step 2 — Add PostgreSQL on Railway

1. In the same Railway project, click **New Service → Database → PostgreSQL**
2. Once it's provisioned, click the Postgres service → **Variables**
3. Copy the `DATABASE_URL` value
4. Go to your **bot service → Variables** and add:

| Variable | Value |
|----------|-------|
| `DISCORD_TOKEN` | Your bot token from [discord.com/developers](https://discord.com/developers/applications) |
| `DATABASE_URL` | Paste the value copied from the Postgres service |

> Railway automatically injects `PORT` — you don't need to set it manually.

5. The bot service will redeploy automatically. Check **Logs** to confirm:
   - `✅ PostgreSQL Schema Verified.`
   - `🚀 API Server running on port ...`
   - `✅ Logged in as Luminia#XXXX!`

---

## Step 3 — Get Your Railway API URL

1. In the bot Railway service, go to **Settings → Networking → Generate Domain**
2. Copy the public URL — it will look like `https://luminia-bot-production.up.railway.app`
3. Keep this URL handy for the next step

---

## Step 4 — Deploy the Web on Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import `Moon-Havoc/Luminia` from GitHub
3. Set the **Root Directory** to `web`
4. Under **Environment Variables**, add:

| Variable | Value |
|----------|-------|
| `VITE_API_URL` | Your Railway URL from Step 3 (no trailing slash) |

5. Click **Deploy** — Vercel will run `vite build` automatically
6. Your site will be live at `https://luminia.vercel.app` (or your custom domain)

---

## Step 5 — Verify Everything Works

- [ ] Visit your Vercel URL — the site loads
- [ ] Click **Get Key** — a `LUM_XXXXXXXXXXXXXXXX` key appears
- [ ] In Discord, run `!gen-key @user robloxname` — bot replies with a unique key
- [ ] Run `!blacklist @user spamming` — user is added to blacklist
- [ ] Check Railway logs — no errors

---

## Environment Variables Summary

### `bot/` (set in Railway)
| Variable | Required | Description |
|----------|----------|-------------|
| `DISCORD_TOKEN` | ✅ | Bot token from Discord Developer Portal |
| `DATABASE_URL` | ✅ | PostgreSQL connection string from Railway |
| `PORT` | Auto | Set automatically by Railway |

### `web/` (set in Vercel)
| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | ✅ | Your Railway bot public URL |

---

## Troubleshooting

**Bot shows `⚠️ No DATABASE_URL found`**
→ Make sure `DATABASE_URL` is set in Railway bot service variables, not just the Postgres service

**Web `Get Key` button fails**
→ Check `VITE_API_URL` in Vercel has no trailing slash and matches your Railway domain exactly

**`❌ Discord Login Failed`**
→ Regenerate your bot token in the Discord Developer Portal and update `DISCORD_TOKEN` in Railway
