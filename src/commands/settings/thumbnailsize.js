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

const { Command } = require('discord-akairo');
const { PermissionsBitField } = require('discord.js');

module.exports = class CommandImageSize extends Command {
    constructor () {
        super('thumbnailsize', {
            aliases: ['thumbnailsize'],
            category: '⚙ Settings',
            description: {
                text: "Changes the track's thumbnail size of the \"Now Playing\" embeds.",
                usage: '<string:size>',
                details: '`<string:size>` The size of the track\'s image, either `small` or `large`. Default is `small`.'
            },
            clientPermissions: PermissionsBitField.Flags.EmbedLinks,
            userPermissions: [PermissionsBitField.Flags.ManageGuild],
            args: [
                {
                    id: 'size',
                    type: 'string'
                }
            ]
        });
    }

    async exec (message, args) {
        if (!args.size) return this.client.ui.usage(message, 'imagesize <string:size>');

        switch ((args.size).toLowerCase()) {
        case 'small': {
            await this.client.settings.set(message.guild.id, 'small', 'thumbnailSize');
            this.client.ui.reply(message, 'ok', 'Thumbnail size has been set to **small**.');
            break;
        }

        case 'large': {
            await this.client.settings.set(message.guild.id, 'large', 'thumbnailSize');
            this.client.ui.reply(message, 'ok', 'Thumbnail size has been set to **large**.');
            break;
        }

        default: {
            this.client.ui.reply(message, 'error', 'Toggle must be **large** or **small**.');
            break;
        }
        }
    }
};
