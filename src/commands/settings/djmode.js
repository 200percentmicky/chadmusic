/**
 *  Micky-bot
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

const { Command } = require('discord-akairo');

module.exports = class CommandDJMode extends Command {
    constructor () {
        super('djmode', {
            aliases: ['djmode'],
            category: '⚙ Settings',
            description: {
                text: 'Toggles DJ Mode for the server.',
                usage: '<toggle:on/off>',
                details: 'Requires the DJ role or the **Manage Channels** permission.'
            },
            clientPermissions: ['EMBED_LINKS']
        });
    }

    async exec (message) {
        const djRole = this.client.settings.get(message.guild.id, 'djRole');
        const dj = message.member.roles.cache.has(djRole) || message.channel.permissionsFor(message.member.user.id).has(['MANAGE_CHANNELS']);
        if (!dj) return this.client.ui.reply(message, 'no', 'You must have the DJ role or the **Manage Channels** permissions to toggle DJ Mode.');

        const args = message.content.split(/ +/g);
        if (!args[1]) return this.client.ui.usage(message, 'djmode <toggle:on/off>');
        if (args[1] === 'ON'.toLowerCase()) {
            await this.client.settings.set(message.guild.id, true, 'djMode');
            return this.client.ui.reply(message, 'ok', 'DJ Mode has been **enabled**.');
        } else if (args[1] === 'OFF'.toLowerCase()) {
            await this.client.settings.set(message.guild.id, false, 'djMode');
            return this.client.ui.reply(message, 'ok', 'DJ Mode has been **disabled**.');
        } else {
            return this.client.ui.reply(message, 'error', 'Toggle must be **on** or **off**.');
        }
    }
};
