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

const { stripIndents } = require('common-tags');
const { AttachmentBuilder } = require('discord.js');
const { Command } = require('discord-akairo');
const { Paginator } = require('array-paginator');
const ytdl = require('@distube/ytdl-core');
const _ = require('lodash');

module.exports = class CommandPlaylist extends Command {
    constructor () {
        super('playlist', {
            aliases: ['playlist', 'pl'],
            description: {
                text: 'Manages the playlists for this server.',
                usage: '<add/new/remove/delete> <name> <tracks...>',
                details: stripIndents`

                __**Subcommands:**__
                **add:** Adds a track to an existing playlist.
                **delete:** Deletes a playlist.
                **view:** List all tracks in a playlist.
                **new:** Creates a new playlist.
                **remove:** Removes a track from a playlist.

                \`<name>\` The name of the playlist. Use quotations if the name contains spaces.
                \`<tracks...>\` The track(s) to add or remove from the playlist. The track(s) to add or remove must be a URL. Optional when creating, deleting, or viewing a playlist.
                `
            },
            category: '⚙ Settings',
            args: [
                {
                    id: 'subcommand',
                    match: 'phrase',
                    type: 'string'
                },
                {
                    id: 'name',
                    match: 'phrase',
                    type: 'string'
                },
                {
                    id: 'tracks',
                    match: 'separate',
                    type: 'url'
                }
            ]
        });
    }

    async exec (message, args) {
        if (!this.client.utils.isDJ(message.channel, message.member)) {
            return this.client.ui.sendPrompt(message, 'NO_DJ');
        }

        await this.client.playlists.ensure(message.guild.id, {});

        switch (args.subcommand) {
        case 'add': {
            const player = this.client.player.getQueue(message.guild);

            if (!args.name) {
                // eslint-disable-next-line no-empty, brace-style
                if (player) {}
                else return this.client.ui.usage(message, 'playlist add <name> <track>');
            }

            if (!this.client.playlists.has(message.guild.id, args.name)) {
                return this.client.ui.reply(message, 'warn', `Playlist \`${args.name}\` does not exist.`);
            }

            if (args.tracks ?? player) {
                try {
                    let dupes = 0;
                    let dupesList = '';

                    message.channel.sendTyping();

                    // Might be resource intensive...
                    for (const x of args.tracks ?? [player.songs[0].url]) {
                        const track = await ytdl.getInfo(x.href?.replace(/,$/g) ?? x);
                        const trackInfo = {
                            title: track.videoDetails.title,
                            url: track.videoDetails.video_url
                        };

                        if (!this.client.utils.hasURL(x) || !track) {
                            return this.client.ui.reply(message, 'warn', 'All tracks must be a URL.');
                        }

                        const trackExists = _.find(this.client.playlists.get(message.guild.id, args.name), trackInfo);

                        if (trackExists) {
                            dupesList += `- **${trackInfo.title}**\n`;
                            dupes += 1;
                        } else {
                            await this.client.playlists.push(message.guild.id, trackInfo, args.name, false);
                        }
                    }
                    if (dupes) {
                        this.client.ui.reply(message, 'warn', `**${dupes}** ${dupes === 1 ? 'track' : 'tracks'} already exist in the playlist.\n${dupesList}`);
                        if ((args.tracks?.length ?? [player.songs[0].url].length) - dupes === 0) break;
                    }
                    this.client.ui.reply(message, 'ok', `Added **${(args.tracks?.length ?? [player.songs[0].url].length)}** track(s) to the playlist \`${args.name}\`.`);
                } catch (err) {
                    console.log(err);
                    this.client.ui.reply(message, 'error', `Unable to add the tracks to playlist \`${args.name}\`. ${err.message}`);
                }
            }

            break;
        }

        case 'delete': {
            if (!args.name) {
                return this.client.ui.usage(message, 'playlist delete <name>');
            }

            if (!this.client.playlists.has(message.guild.id, args.name)) {
                return this.client.ui.reply(message, 'warn', `Playlist \`${args.name}\` does not exist.`);
            }

            try {
                await this.client.playlists.delete(message.guild.id, args.name);
                return this.client.ui.reply(message, 'ok', `Deleted the playlist \`${args.name}\`.`);
            } catch (err) {
                this.client.ui.reply(message, 'error', `Unable to delete the playlist \`${args.name}\`. ${err.message}`);
            }

            break;
        }

        case 'view': {
            if (!args.name) {
                return this.client.ui.usage(message, 'playlist view <name>');
            }

            if (!this.client.playlists.has(message.guild.id, args.name)) {
                return this.client.ui.reply(message, 'warn', `Playlist \`${args.name}\` does not exist.`);
            }

            const playlist = this.client.playlists.get(message.guild.id, args.name);
            const trackList = playlist.map(x => `${playlist.indexOf(x) + 1}: ${x.title}`).join('\n');

            await this.client.ui.custom(
                message,
                ':page_with_curl:',
                message.guild.members.me.displayColor !== 0 ? message.guild.members.me.displayColor : null,
                trackList,
                `${args.name}`,
                `${playlist.length} ${playlist.length === 1 ? 'track' : 'tracks'}`
            );

            break;
        }

        case 'new': {
            if (!args.name) {
                return this.client.ui.usage(message, 'playlist new <name>');
            }

            try {
                if (this.client.playlists.has(message.guild.id, args.name)) {
                    return this.client.ui.reply(message, 'warn', `Playlist \`${args.name}\` already exists.`);
                } else {
                    await this.client.playlists.set(message.guild.id, [], args.name);
                }
                return this.client.ui.reply(message, 'ok', `Created new playlist \`${args.name}\`.`);
            } catch (err) {
                this.client.ui.reply(message, 'error', `Unable to create the playlist \`${args.name}\`. ${err.message}`);
            }

            break;
        }

        case 'remove': {
            if (!args.name) {
                return this.client.ui.usage(message, 'playlist remove <name> <tracks...>');
            }

            break;
            
            // Work in progress... stay tuned!
            try {
                if (this.client.playlists.has(message.guild.id, args.name)) {
                    return this.client.ui.reply(message, 'warn', `Playlist \`${args.name}\` does not exist.`);
                } else {
                    await this.client.playlists.set(message.guild.id, [], args.name);
                }
                return this.client.ui.reply(message, 'ok', `Created new playlist \`${args.name}\`.`);
            } catch (err) {
                this.client.ui.reply(message, 'error', `Unable to create the playlist \`${args.name}\`. ${err.message}`);
            }

            break;
        }

        default: {
            return this.client.ui.usage(message, 'playlist <add/new/remove/delete> <name> <tracks...>');
        }
        }
    }
};
