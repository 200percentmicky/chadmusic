/// ChadMusic - The Chad Music Bot
/// Copyright (C) 2023  Micky D. | @200percentmicky | Micky-kun#3836
///
/// This program is free software: you can redistribute it and/or modify
/// it under the terms of the GNU General Public License as published by
/// the Free Software Foundation, either version 3 of the License, or
/// (at your option) any later version.
///
/// This program is distributed in the hope that it will be useful,
/// but WITHOUT ANY WARRANTY; without even the implied warranty of
/// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
/// GNU General Public License for more details.
///
/// You should have received a copy of the GNU General Public License
/// along with this program.  If not, see <https://www.gnu.org/licenses/>.

const { Listener } = require('discord-akairo');

module.exports = class CommandMissingPermissions extends Listener {
    constructor () {
        super('missingPermissions', {
            emitter: 'commandHandler',
            event: 'missingPermissions'
        });
    }

    async exec (message, command, type, missing) {
        /* eslint-disable quote-props */
        // Just so you know, they're being converted to BigInt.
        const permissionsBits = {
            '64': 'Add Reactions',
            '8': 'Administrator',
            '32768': 'Attach Files',
            '4': 'Ban Members',
            '67108864': 'Change Nickname',
            '1048576': 'Connect',
            '1': 'Create Instant Invite',
            '68719476736': 'Create Private Threads',
            '34359738368': 'Create Public Threads',
            '8388608': 'Deafen Members',
            '16384': 'Embed Links',
            '2': 'Kick Members',
            '16': 'Manage Channels',
            '1073741824': 'Manage Emojis and Stickers',
            '8589934592': 'Manage Events',
            '32': 'Manage Server',
            '8192': 'Manage Messages',
            '134217728': 'Manage Nicknames',
            '268435456': 'Manage Roles',
            '17179869184': 'Manage Threads',
            '536870912': 'Manage Webhooks',
            '131072': 'Mention Everyone, Here, and All Roles',
            '1099511627776': 'Moderate Members',
            '16777216': 'Move Members',
            '4194304': 'Mute Members',
            '256': 'Priority Speaker',
            '65536': 'Read Message History',
            '4294967296': 'Request to Speak',
            '2048': 'Send Messages',
            '274877906944': 'Send Messages in Threads',
            '4096': 'Send Text-To-Speech Messages',
            '2097152': 'Speak',
            '512': 'Stream',
            '2147483648': 'Use Application Commands',
            '549755813888': 'Use Embedded Activities',
            '262144': 'Use External Emojis',
            '137438953472': 'Use External Stickers',
            '33554432': 'Use Voice Activity Detection',
            '128': 'View Audit Log',
            '1024': 'View Channel',
            '524288': 'View Guild Insights'
        };

        const clientPerms = await missing.map(missing => permissionsBits[missing]).join(', ');
        const userPerms = await missing.map(missing => permissionsBits[missing]).join(', ');

        if (type === 'client') {
            return this.client.ui.reply(message, 'warn', `I require the **${clientPerms}** permission(s) to execute that command.`);
        }

        if (type === 'user') {
            if (command.userPermissions === 'ADMINISTRATOR') return this.client.ui.reply(message, 'no', 'Only server administrators can use that command.');
            else return this.client.ui.reply(message, 'no', `You need the **${userPerms}** permission(s) to use that command.`);
        }
    }
};
