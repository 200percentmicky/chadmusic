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
const _ = require('lodash');
const { PermissionFlagsBits } = require('discord.js');

module.exports = class CommandPlaylistRemove extends Command {
    constructor () {
        super('playlist-remove', {
            aliases: ['playlist-remove', 'plremove'],
            description: {
                text: 'Removes a track from a playlist.',
                usage: '<"name"> <index_or_start> [end]',
                details: stripIndents`
                \`<"name">\` The name of the playlist. Use quotations if the name contains spaces.
                \`<index_or_start>\` The track's index number, or the starting index to remove multiple tracks.
                \`[end]\` The ending index to remove multiple tracks.
                `
            },
            category: '📜 Playlists',
            args: [
                {
                    id: 'name',
                    match: 'phrase',
                    type: 'string'
                },
                {
                    id: 'start',
                    type: 'number'
                },
                {
                    id: 'end',
                    type: 'number'
                }
            ]
        });
    }

    async exec (message, args) {
        if (!this.client.utils.isDJ(message.channel, message.member)) {
            return this.client.ui.sendPrompt(message, 'NO_DJ');
        }

        await this.client.playlists.ensure(message.guild.id, {});

        if (!this.client.playlists.has(message.guild.id, args.name)) {
            return this.client.ui.reply(message, 'warn', `Playlist \`${args.name}\` does not exist.`);
        }

        if (this.client.playlists.get(message.guild.id, args.name).user !== message.member.user.id) {
            if (message.channel.permissionsFor(message.member.user.id).has(PermissionFlagsBits.Administrator)) {} // eslint-disable-line no-empty, brace-style
            else return this.client.ui.reply(message, 'no', `\`${args.name}\` is not your playlist.`);
        }

        if (!args.name) {
            return this.client.ui.usage(message, 'playlist-remove <"name"> <index_or_start> [end]');
        }

        try {
            // This is more or less a copy and paste of the remove command lol
            message.channel.sendTyping();
            const playlist = this.client.playlists.get(message.guild.id, args.name);

            if (args.end) {
                const start = parseInt(args.start);
                const end = parseInt(args.end);

                if (isNaN(start)) return this.client.ui.reply(message, 'error', 'Starting index position must be a number.');
                if (isNaN(end)) return this.client.ui.reply(message, 'error', 'Ending index position must be a number.');

                const tracks = _.slice(playlist.tracks, start - 1, end);
                const changedList = _.pullAll(playlist.tracks, tracks);

                this.client.playlists.set(message.guild.id, changedList, `${args.name}.tracks`);

                return this.client.ui.reply(message, 'ok', `**${tracks.length}** track${tracks.length === 1 ? '' : 's'} removed from \`${args.name}\`.`);
            } else {
                const start = parseInt(args.start);
                if (isNaN(start)) return this.client.ui.reply(message, 'error', 'Track index must be a number.');

                const track = playlist.tracks[start - 1];

                if (!_.find(playlist.tracks, track) || start < 1 || start > playlist.tracks.length) {
                    return this.client.ui.reply(message, 'warn', 'That entry does not exist.');
                }

                const changedList = _.remove(playlist.tracks, (obj) => {
                    return obj.url !== track?.url;
                });
                this.client.playlists.set(message.guild.id, changedList, `${args.name}.tracks`);

                return this.client.ui.reply(message, 'ok', `Removed **${track?.title}** from \`${args.name}\`.`);
            }
        } catch (err) {
            this.client.ui.reply(message, 'error', `Unable to remove any tracks from the playlist \`${args.name}\`. ${err.message}`);
        }
    }
};
