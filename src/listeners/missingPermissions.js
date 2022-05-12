/**
 *  ChadMusic - The Chad Music Bot
 *  Copyright (C) 2022  Micky D. | @200percentmicky | Micky-kun#3836
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

const { Listener } = require('discord-akairo');

module.exports = class CommandMissingPermissions extends Listener {
    constructor () {
        super('missingPermissions', {
            emitter: 'commandHandler',
            event: 'missingPermissions'
        });
    }

    async exec (message, command, type, missing) {
        const permissions = {
            CREATE_INSTANT_INVITE: 'Create Instant Invite',
            KICK_MEMBERS: 'Kick Members',
            BAN_MEMBERS: 'Ban Members',
            ADMINISTRATOR: 'Administrator',
            MANAGE_CHANNELS: 'Manage Channels',
            MANAGE_GUILD: 'Manage Server',
            ADD_REACTIONS: 'Add Reactions',
            VIEW_AUDIT_LOG: 'View Audit Log',
            PRIORITY_SPEAKER: 'Priority Speaker',
            STREAM: 'Video',
            VIEW_CHANNEL: 'Read Messages',
            SEND_MESSAGES: 'Send Messages',
            SEND_TTS_MESSAGES: 'Send TTS Messages',
            MANAGE_MESSAGES: 'Manage Messages',
            EMBED_LINKS: 'Embed Links',
            ATTACH_FILES: 'Attach Files',
            READ_MESSAGE_HISTORY: 'Read Message History',
            MENTION_EVERYONE: 'MENTION_EVERYONE',
            USE_EXTERNAL_EMOJIS: 'Use External Emojis',
            VIEW_GUILD_INSIGHTS: 'View Server Insights',
            CONNECT: 'Connect',
            SPEAK: 'Speak',
            MUTE_MEMBERS: 'Mute Members',
            DEAFEN_MEMBERS: 'Deafen Members',
            MOVE_MEMBERS: 'Move Members',
            USE_VAD: 'Use Voice Activity Detection',
            CHANGE_NICKNAME: 'Change Nickname',
            MANAGE_NICKNAMES: 'Manage Nicknames',
            MANAGE_ROLES: 'Manage Roles',
            MANAGE_WEBHOOKS: 'Manage Webhooks',
            MANAGE_EMOJIS: 'Manage Emojis'
        };

        const clientPerms = await missing.map(missing => permissions[missing]).join(', ');
        const userPerms = await missing.map(missing => permissions[missing]).join(', ');

        if (type === 'client') {
            return this.client.ui.reply(message, 'warn', `I require the **${clientPerms}** permission(s) to execute that command.`);
        }

        if (type === 'user') {
            if (command.userPermissions === 'ADMINISTRATOR') return this.client.ui.reply(message, 'no', 'Only server administrators can use that command.');
            else return this.client.ui.reply(message, 'no', `You need the **${userPerms}** permission(s) to use that command.`);
        }
    }
};
