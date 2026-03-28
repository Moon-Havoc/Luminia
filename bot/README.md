# Luminia Bot Commands

This document lists available commands for the Luminia Discord bot and basic usage.

## Prefix

- `!` (e.g., `!prem-gen @user robloxuser`)

## Licensing

- `!prem-gen @user robloxuser`
  - Grants a premium slot and stores whitelist record via `Database.whitelistUser`.
  - Admin only.

- `!gen-key @user robloxuser`
  - Generates a new key and stores via `Database.whitelistUser`.
  - Admin only.

- `!reset_hwid`
  - Resets the caller's HWID via `Database.resetHWID`.

- `!revoke_key @user key`
  - Revokes a key for the user via `Database.revokeKey`.
  - Admin only.

- `!revoke_prem @user key`
  - Revokes premium status for the user via `Database.whitelistUser(..., 0)`.
  - Admin only.

## Blacklist

- `!blacklist @user reason`
  - Adds a blacklist entry via `Database.blacklistUser`.
  - Admin only.

- `!blacklists @user`
  - Checks if a user is blacklisted via `Database.getBlacklist`.

- `!unblacklist @user`
  - Removes blacklist entry via `Database.unblacklistUser`.
  - Admin only.

## Moderation

- `!ban @user reason`
  - Requires `BanMembers` permission.

- `!kick @user reason`
  - Requires `KickMembers` permission.

- `!mute @user duration reason`
  - Requires `ModerateMembers` permission.
  - `duration` in seconds (min 5, max 2419200).

- `!unmute @user`
  - Requires `ModerateMembers` permission.

- `!role @user @role`
  - Requires `ManageRoles` permission.

- `!unban userId`
  - Requires `BanMembers` permission.

## Notes

- Commands are invoked in `bot/index.js` and mapped via `Commands` object in `bot/commands.js`.
- If a command throws, the bot replies: `❌ There was an error executing that command.`
