/// ChadMusic
/// Copyright (C) 2025  Micky | 200percentmicky
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

const { Command } = require('discord-akairo');
const { PermissionsBitField } = require('discord.js');

module.exports = class CommandLeaveOnFinish extends Command {
    constructor () {
        super('leaveonfinish', {
            aliases: ['leaveonfinish'],
            category: '⚙ Settings',
            description: {
                text: 'Toggles whether the bot should leave when the end of the queue has been reached.',
                usage: '<toggle:on/off>',
                details: '`<toggle:on/off>` The toggle of the setting.'
            },
            userPermissions: [PermissionsBitField.Flags.ManageGuild],
            args: [
                {
                    id: 'toggle',
                    match: 'text'
                }
            ]
        });
    }

    async exec (message, args) {
        if (!args.toggle) return this.client.ui.usage(message, 'leaveonfinish <toggle:on/off>');

        const settings = this.client.settings;
        const queue = await this.client.player.getQueue(message.guild);
        switch (args.toggle) {
        case 'true':
        case 'on': {
            await settings.set(message.guild.id, true, 'leaveOnFinish');
            if (queue) queue.leaveOnFinish = true;
            this.client.ui.reply(message, 'ok', 'I\'ll leave the voice channel when the queue finishes.');
            break;
        }
        case 'false':
        case 'off': {
            await settings.set(message.guild.id, false, 'leaveOnFinish');
            if (queue) queue.leaveOnFinish = false;
            this.client.ui.reply(message, 'ok', 'I\'ll stay in the voice channel when the queue finishes.');
            break;
        }
        default: {
            this.client.ui.reply(message, 'error', 'Toggle must be **on** or **off**.');
            break;
        }
        }
    }
};
