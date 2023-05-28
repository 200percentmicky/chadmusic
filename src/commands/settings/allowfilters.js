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

const { Command } = require('discord-akairo');
const { PermissionsBitField } = require('discord.js');

module.exports = class CommandAllowFilters extends Command {
    constructor () {
        super('allowfilters', {
            aliases: ['allowfilters'],
            category: '⚙ Settings',
            description: {
                text: 'Toggles the ability to allow members to apply filters to the player.',
                usage: '<toggle:on/off>',
                details: '`<toggle:on/off>` The toggle of the setting.'
            },
            clientPermissions: [PermissionsBitField.Flags.EmbedLinks],
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
        if (!args.toggle) return this.client.ui.usage(message, 'allowfilters <toggle:on/off>');
        if (args.toggle === 'OFF'.toLowerCase()) {
            await this.client.settings.set(message.guild.id, false, 'allowFilters');
            return this.client.ui.reply(message, 'ok', 'Filters have been disabled. Only DJs will be able to apply filters.');
        } else if (args.toggle === 'ON'.toLowerCase()) {
            await this.client.settings.set(message.guild.id, true, 'allowFilters');
            return this.client.ui.reply(message, 'ok', 'Filters have been enabled.');
        } else {
            return this.client.ui.reply(message, 'error', 'Toggles must be **on** or **off**');
        }
    }
};
