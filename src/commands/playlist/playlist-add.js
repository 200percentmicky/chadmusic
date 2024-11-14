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
const ytdl = require('@distube/ytdl-core');
const _ = require('lodash');
const { PermissionFlagsBits } = require('discord.js');

/* eslint-disable no-useless-escape */

module.exports = class CommandPlaylistAdd extends Command {
    constructor () {
        super('playlist-add', {
            aliases: ['playlist-add', 'pladd'],
            description: {
                text: 'Adds a track to an existing playlist.',
                usage: '<"name"> <track>',
                details: stripIndents`
                \`<"name">\` The name of the playlist. Use quotations if the name contains spaces.
                \`[track]\` The track to add to the playlist. The track to add must be a URL. If nothing was provided and a player is active, adds the currently playing track.
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
                    id: 'track',
                    match: 'rest',
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
            else return this.client.ui.usage(message, 'playlist-add <"name"> <track>');
        }

        if (!this.client.playlists.has(message.guild.id, args.name)) {
            return this.client.ui.reply(message, 'warn', `Playlist \`${args.name}\` does not exist.`);
        }

        if (this.client.playlists.get(message.guild.id, args.name).user !== message.member.user.id) {
            if (message.channel.permissionsFor(message.member.user.id).has(PermissionFlagsBits.Administrator)) {} // eslint-disable-line no-empty, brace-style
            else return this.client.ui.reply(message, 'no', `\`${args.name}\` is not your playlist.`);
        }

        if (args.track ?? player) {
            message.channel.sendTyping();

            try {
                let track;

                try {
                    track = await ytdl.getInfo(args.track?.href?.replace(/(^\<+|\>+$)/g, '') ?? player.songs[0].url);
                } catch {
                    track = await this.client.player.ytdlp.resolve(args.track?.href?.replace(/(^\<+|\>+$)/g, '') ?? player.songs[0].url, {
                        member: message.member
                    });
                }

                const trackInfo = {
                    title: track.videoDetails?.title ?? track.name,
                    url: track.videoDetails?.video_url ?? track.url,
                    date_added: Math.floor(Date.now() / 1000)
                };

                if (!this.client.utils.hasURL(args.track?.href?.replace(/(^\<+|\>+$)/g, '') ?? player.songs[0].url) || !track) {
                    return this.client.ui.reply(message, 'error', 'The track must be a URL.');
                }

                const trackExists = _.find(this.client.playlists.get(message.guild.id, `${args.name}.tracks`), (obj) => {
                    return obj.url === trackInfo.url;
                });

                if (trackExists) {
                    return this.client.ui.reply(message, 'warn', `**${trackInfo.title}** already exist in the playlist \`${args.name}\``);
                } else {
                    await this.client.playlists.push(message.guild.id, trackInfo, `${args.name}.tracks`, false);
                }

                this.client.ui.reply(message, 'ok', `Added **${trackInfo.title}** to the playlist \`${args.name}\`.`);
            } catch (err) {
                console.log(err);
                this.client.ui.reply(message, 'error', `Unable to add the track to the playlist \`${args.name}\`. ${err.message}`);
            }
        } else if (!args.track && !player) {
            return this.client.ui.sendPrompt(message, 'NOT_PLAYING');
        }
    }
};
