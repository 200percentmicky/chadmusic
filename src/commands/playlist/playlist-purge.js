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
const { PermissionFlagsBits } = require('discord.js');

module.exports = class CommandPlaylistPurge extends Command {
    constructor () {
        super('playlist-purge', {
            aliases: ['playlist-purge', 'plpurge'],
            description: {
                text: 'Deletes all playlists on the server.'
            },
            category: '📜 Playlists',
            userPermissions: PermissionFlagsBits.Administrator
        });
    }

    async exec (message) {
        if (!this.client.utils.isDJ(message.channel, message.member)) {
            return this.client.ui.sendPrompt(message, 'NO_DJ');
        }

        await this.client.playlists.ensure(message.guild.id, {});

        try {
            await this.client.playlists.delete(message.guild.id);
            return this.client.ui.reply(message, 'ok', 'All playlists on the server have been deleted.');
        } catch (err) {
            this.client.ui.reply(message, 'error', `Unable to delete all playlists. ${err.message}`);
        }
    }
};
