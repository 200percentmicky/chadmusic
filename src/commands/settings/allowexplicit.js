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

module.exports = class CommandAllowExplicit extends Command {
    constructor () {
        super('allowexplicit', {
            aliases: ['allowexplicit'],
            category: '⚙ Settings',
            description: {
                text: 'Toggles the ability to allow age restricted content in the queue.',
                usage: '<toggle:on/off>',
                details: `\`<toggle:on/off>\` The toggle of the setting.\n${process.env.EMOJI_WARN} This setting only applies to videos on YouTube. All pornographic websites are blocked regardless if this setting is on or not.`
            },
            userPermissions: ['MANAGE_GUILD']
        });
    }

    async exec (message) {
        const args = message.content.split(/ +/g);
        if (!args[1]) return this.client.ui.usage(message, 'allowexplicit <toggle:on/off>');

        const settings = this.client.settings;
        switch (args[1]) {
        case 'on': {
            await settings.set(message.guild.id, true, 'allowAgeRestricted');
            this.client.ui.reply(message, 'ok', 'Age restricted content can now be added to the queue.');
            break;
        }
        case 'off': {
            await settings.set(message.guild.id, false, 'allowAgeRestricted');
            this.client.ui.reply(message, 'ok', 'Age restricted content can no longer be added to the queue.');
            break;
        }
        default: {
            this.client.ui.reply(message, 'error', 'Toggle must be **on** or **off**.');
            break;
        }
        }
    }
};
