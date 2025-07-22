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

module.exports = class CommandDefaultVolume extends Command {
    constructor () {
        super('defaultvolume', {
            aliases: ['defaultvolume'],
            category: '⚙ Settings',
            description: {
                text: "Changes the bot's default volume when starting a queue, or when disabling Earrape.",
                usage: '<volume:1-200>',
                details: '`<volume:1-200>` The new default volume for the server.'
            },
            userPermissions: [PermissionsBitField.Flags.ManageGuild],
            args: [
                {
                    id: 'volume',
                    type: 'string'
                }
            ]
        });
    }

    async exec (message, args) {
        const volume = parseInt(args.volume);

        if (!volume) {
            return this.client.ui.usage(message, 'defaultvolume <volume:1-200>');
        }

        if (isNaN(volume)) {
            return this.client.ui.reply(message, 'error', 'Default volume must be a number.');
        }

        if (volume > 200 || volume < 1) {
            return this.client.ui.reply(message, 'error', 'Default volume must be between **1-200**.');
        }

        await this.client.settings.set(message.guild.id, volume, 'defaultVolume');
        return this.client.ui.reply(message, 'ok', `The default volume is now **${volume}%**.`);
    }
};
