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
const { Command } = require('discord-akairo');
const ytdl = require('@distube/ytdl-core');
const _ = require('lodash');

module.exports = class CommandPlaylistAdd extends Command {
    constructor () {
        super('playlist-add', {
            aliases: ['playlist-add', 'pladd'],
            description: {
                text: 'Adds a track to an existing playlist.',
                usage: '<playlist> <"name"> <tracks...>',
                details: stripIndents`
                \`<"name">\` The name of the playlist. Use quotations if the name contains spaces.
                \`<tracks...>\` The track(s) to add to the playlist. The track(s) to add must be a URL.
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

        const player = this.client.player.getQueue(message.guild);

        if (!args.name) {
            // eslint-disable-next-line no-empty, brace-style
            if (player) {}
            else return this.client.ui.usage(message, 'playlist add <name> <track>');
        }

        if (!this.client.playlists.has(message.guild.id, args.name)) {
            return this.client.ui.reply(message, 'warn', `Playlist \`${args.name}\` does not exist.`);
        }

        // TODO: Revert to adding one track instead of multiples.
        if (args.tracks ?? player) {
            try {
                let dupes = 0;
                let dupesList = '';

                message.channel.sendTyping();

                // Might be resource intensive...
                for (const x of args.tracks ?? [player.songs[0].url]) {
                    let track;
                    try {
                        track = await ytdl.getInfo(x.href?.replace(/,$/g) ?? x);
                    } catch {
                        for (const p of this.client.player.extractorPlugins) {
                            if (p.validate(x.href?.replace(/,$/g) ?? x)) {
                                track = await p.resolve(x.href?.replace(/,$/g) ?? x, {
                                    member: message.member
                                });
                            }
                        }
                    }
                    const trackInfo = {
                        title: track.videoDetails?.title ?? track.name,
                        url: track.videoDetails?.video_url ?? track.url,
                        date_added: Math.floor(Date.now() / 1000)
                    };

                    if (!this.client.utils.hasURL(x) || !track) {
                        return this.client.ui.reply(message, 'warn', 'All tracks must be a URL.');
                    }

                    const trackExists = _.find(this.client.playlists.get(message.guild.id, `${args.name}.tracks`), (obj) => {
                        return obj.url === trackInfo.url;
                    });

                    if (trackExists) {
                        dupesList += `- **${trackInfo.title}**\n`;
                        dupes += 1;
                    } else {
                        await this.client.playlists.push(message.guild.id, trackInfo, `${args.name}.tracks`, false);
                    }
                }
                if (dupes) {
                    this.client.ui.reply(message, 'warn', `**${dupes}** ${dupes === 1 ? 'track' : 'tracks'} already exist in the playlist.\n${dupesList}`);
                    if ((args.tracks?.length ?? [player.songs[0].url].length) - dupes === 0) return;
                }
                this.client.ui.reply(message, 'ok', `Added **${(args.tracks?.length ?? [player.songs[0].url].length)}** track(s) to the playlist \`${args.name}\`.`);
            } catch (err) {
                console.log(err);
                this.client.ui.reply(message, 'error', `Unable to add the tracks to playlist \`${args.name}\`. ${err.message}`);
            }
        }
    }
};
