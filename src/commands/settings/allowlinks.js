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

module.exports = class CommandAllowLinks extends Command {
    constructor () {
        super('allowlinks', {
            aliases: ['allowlinks'],
            category: '⚙ Settings',
            description: {
                text: 'Toggles the ability to add songs to the queue from a URL.',
                usage: '<toggle:on/off>',
                details: '`<toggle:on/off>` The toggle of the setting.'
            },
            userPermissions: ['MANAGE_GUILD']
        });
    }

    async exec (message) {
        const args = message.content.split(/ +/g);
        if (!args[1]) return this.client.ui.usage(message, 'allowlinks <toggle:on/off>');

        const settings = this.client.settings;
        switch (args[1]) {
        case 'on': {
            await settings.set(message.guild.id, true, 'allowLinks');
            this.client.ui.reply(message, 'ok', 'URLs can now be added to the queue.');
            break;
        }
        case 'off': {
            await settings.set(message.guild.id, false, 'allowLinks');
            this.client.ui.reply(message, 'ok', 'URLs can no longer be added to the queue.');
            break;
        }
        default: {
            this.client.ui.reply(message, 'error', 'Toggle must be **on** or **off**.');
            break;
        }
        }
    }
};
