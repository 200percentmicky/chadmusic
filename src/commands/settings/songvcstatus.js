/// ChadMusic - The Chad Music Bot
/// Copyright (C) 2024  Micky | 200percentmicky
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

const { stripIndents } = require('common-tags');
const { Command } = require('discord-akairo');
const { PermissionsBitField } = require('discord.js');

module.exports = class CommandSongVcStatus extends Command {
    constructor () {
        super('songvcstatus', {
            aliases: ['songvcstatus'],
            category: '⚙ Settings',
            description: {
                text: stripIndents`
                Toggles whether the bot will set the playing track's title as a status for the voice channel.

                :warning: **Experimental** - This feature uses an undocumented endpoint in Discord's API and may change at anytime.
                `,
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
        if (!args.toggle) return this.client.ui.usage(message, 'songvcstatus <toggle:on/off>');

        switch (args.toggle) {
        case 'true':
        case 'on': {
            await this.client.settings.set(message.guild.id, true, 'songVcStatus');
            this.client.ui.reply(message, 'ok', 'The bot will now set currently playing tracks as a voice channel status.');
            break;
        }
        case 'false':
        case 'off': {
            await this.client.settings.set(message.guild.id, false, 'songVcStatus');
            this.client.ui.reply(message, 'ok', 'The bot will no longer set a voice channel status.');
            break;
        }
        default: {
            this.client.ui.reply(message, 'error', 'Toggle must be **on** or **off**.');
            break;
        }
        }
    }
};
