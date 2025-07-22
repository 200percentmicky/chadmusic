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

const { stripIndents } = require('common-tags');
const { Command } = require('discord-akairo');
const { PermissionFlagsBits } = require('discord.js');

module.exports = class CommandPlaylistDelete extends Command {
    constructor () {
        super('playlist-delete', {
            aliases: ['playlist-delete', 'pldelete'],
            description: {
                text: 'Deletes a playlist',
                usage: '<name>',
                details: stripIndents`
                \`<name>\` The name of the playlist to delete.
                `
            },
            category: '📜 Playlists',
            args: [
                {
                    id: 'name',
                    match: 'rest',
                    type: 'string'
                }
            ]
        });
    }

    async exec (message, args) {
        if (!this.client.utils.isDJ(message.channel, message.member)) {
            return this.client.ui.sendPrompt(message, 'NO_DJ');
        }

        await this.client.playlists.ensure(message.guild.id, {});

        if (!args.name) {
            return this.client.ui.usage(message, 'playlist-delete <name>');
        }

        if (!this.client.playlists.has(message.guild.id, args.name)) {
            return this.client.ui.reply(message, 'warn', `Playlist \`${args.name}\` does not exist.`);
        }

        if (this.client.playlists.get(message.guild.id, args.name).user !== message.member.user.id) {
            if (message.channel.permissionsFor(message.member.user.id).has(PermissionFlagsBits.Administrator)) {} // eslint-disable-line no-empty, brace-style
            else return this.client.ui.reply(message, 'no', `\`${args.name}\` is not your playlist.`);
        }

        try {
            await this.client.playlists.delete(message.guild.id, args.name);
            return this.client.ui.reply(message, 'ok', `Deleted the playlist \`${args.name}\`.`);
        } catch (err) {
            this.client.ui.reply(message, 'error', `Unable to delete the playlist \`${args.name}\`. ${err.message}`);
        }
    }
};
