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

module.exports = class CommandAllowSilentTracks extends Command {
    constructor () {
        super('allowsilenttracks', {
            aliases: ['allowsilenttracks'],
            category: '⚙ Settings',
            description: {
                text: 'Toggles the ability to silently add tracks to the queue.',
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
        if (!args.toggle) return this.client.ui.usage(message, 'allowsilenttracks <toggle:on/off>');

        const settings = this.client.settings;
        switch (args.toggle) {
        case 'on': {
            await settings.set(message.guild.id, true, 'allowSilent');
            this.client.ui.reply(message, 'ok', 'Silent tracks can now be added to the queue.');
            break;
        }
        case 'off': {
            await settings.set(message.guild.id, false, 'allowSilent');
            this.client.ui.reply(message, 'ok', 'Silent tracks can no longer be added to the queue.');
            break;
        }
        default: {
            this.client.ui.reply(message, 'error', 'Toggle must be **on** or **off**.');
            break;
        }
        }
    }
};
