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

const { SlashCommand, CommandOptionType } = require('slash-create');
const { EmbedBuilder } = require('discord.js');
const ytdl = require('@distube/ytdl-core');
const _ = require('lodash');

class CommandPlaylist extends SlashCommand {
    constructor (creator) {
        super(creator, {
            name: 'playlist',
            description: 'Manages playlists on the server.',
            options: [
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'add',
                    description: 'Adds a track or multiple tracks to a playlist.',
                    options: [
                        {
                            type: CommandOptionType.STRING,
                            name: 'name',
                            description: 'The name of the playlist to add tracks to.',
                            required: true
                        },
                        {
                            type: CommandOptionType.STRING,
                            name: 'tracks',
                            description: 'A track or a list of tracks to add to the playlist.'
                        }
                    ]
                },
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'clone',
                    description: 'Creates a playlist by cloning an existing one.',
                    options: [
                        {
                            type: CommandOptionType.STRING,
                            name: 'name',
                            description: 'The name of the playlist to clone.',
                            required: true
                        },
                        {
                            type: CommandOptionType.STRING,
                            name: 'clone_name',
                            description: 'The name to give to the cloned playlist. If nothing, affixes "- Copy" to the original name.'
                        }
                    ]
                },
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'delete',
                    description: 'Deletes a playlist.',
                    options: [
                        {
                            type: CommandOptionType.STRING,
                            name: 'name',
                            description: 'The name of the playlist to delete.',
                            required: true
                        }
                    ]
                },
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'new',
                    description: 'Creates a new playlist.',
                    options: [
                        {
                            type: CommandOptionType.STRING,
                            name: 'name',
                            description: 'The name of the new playlist.',
                            required: true
                        }
                    ]
                },
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'purge',
                    description: 'Deletes all playlists on the server.'
                },
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'remove',
                    description: 'Removes a track or multiple tracks from a playlist.',
                    options: [
                        {
                            type: CommandOptionType.STRING,
                            name: 'name',
                            description: 'The name of the playlist to remove tracks.',
                            required: true
                        },
                        {
                            type: CommandOptionType.STRING,
                            name: 'tracks',
                            description: 'The track or multiple tracks to remove from the playlist.',
                            required: true
                        }
                    ]
                },
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'show',
                    description: 'Lists all playlists on the server.'
                },
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'url',
                    description: 'Adds an existing online playlist from a URL.',
                    options: [
                        {
                            type: CommandOptionType.STRING,
                            name: 'url',
                            description: 'The URL of the playlist to add.',
                            required: true
                        }
                    ]
                },
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'view',
                    description: 'List all tracks in a playlist.',
                    options: [
                        {
                            type: CommandOptionType.STRING,
                            name: 'name',
                            description: 'The name of the playlist to view.',
                            required: true
                        }
                    ]
                }
            ]
        });

        this.filePath = __filename;
    }

    async run (ctx) {
        const guild = this.client.guilds.cache.get(ctx.guildID);
        const channel = await guild.channels.fetch(ctx.channelID);
        const member = await guild.members.fetch(ctx.member.id);

        if (!this.client.utils.isDJ(channel, member)) {
            return this.client.ui.sendPrompt(ctx, 'NO_DJ');
        }

        await ctx.defer();

        await this.client.playlists.ensure(guild.id, {});

        switch (ctx.subcommands[0]) {
        case 'add': {
            const player = this.client.player.getQueue(guild);

            if (!this.client.playlists.has(guild.id, ctx.options.add.name)) {
                return this.client.ui.reply(ctx, 'warn', `Playlist \`${ctx.options.add.name}\` does not exist.`);
            }

            if (ctx.options.add.tracks ?? player) {
                try {
                    let dupes = 0;
                    let dupesList = '';

                    // Might be resource intensive...
                    for (const x of ctx.options.add.tracks ?? [player.songs[0].url]) {
                        const track = await ytdl.getInfo(x.href?.replace(/,$/g) ?? x);
                        const trackInfo = {
                            title: track.videoDetails.title,
                            url: track.videoDetails.video_url,
                            date_added: Math.floor(Date.now() / 1000)
                        };

                        if (!this.client.utils.hasURL(x) || !track) {
                            return this.client.ui.reply(ctx, 'warn', 'All tracks must be a URL.');
                        }

                        const trackExists = _.find(this.client.playlists.get(guild.id, `${ctx.options.add.name}.tracks`), trackInfo);

                        if (trackExists) {
                            dupesList += `- **${trackInfo.title}**\n`;
                            dupes += 1;
                        } else {
                            await this.client.playlists.push(guild.id, trackInfo, `${ctx.options.add.name}.tracks`, false);
                        }
                    }
                    if (dupes) {
                        this.client.ui.reply(ctx, 'warn', `**${dupes}** ${dupes === 1 ? 'track' : 'tracks'} already exist in the playlist.\n${dupesList}`);
                        if ((ctx.options.add.tracks?.length ?? [player.songs[0].url].length) - dupes === 0) break;
                    }
                    this.client.ui.reply(ctx, 'ok', `Added **${(ctx.options.add.tracks?.length ?? [player.songs[0].url].length)}** track(s) to the playlist \`${ctx.options.add.name}\`.`);
                } catch (err) {
                    console.log(err);
                    this.client.ui.reply(ctx, 'error', `Unable to add the tracks to playlist \`${ctx.options.add.name}\`. ${err.message}`);
                }
            }

            break;
        }

        case 'delete': {
            if (!this.client.playlists.has(guild.id, ctx.options.delete.name)) {
                return this.client.ui.reply(ctx, 'warn', `Playlist \`${ctx.options.delete.name}\` does not exist.`);
            }

            try {
                await this.client.playlists.delete(guild.id, ctx.options.delete.name);
                return this.client.ui.reply(ctx, 'ok', `Deleted the playlist \`${ctx.options.delete.name}\`.`);
            } catch (err) {
                this.client.ui.reply(ctx, 'error', `Unable to delete the playlist \`${ctx.options.delete.name}\`. ${err.message}`);
            }

            break;
        }

        case 'view': {
            if (!this.client.playlists.has(guild.id, ctx.options.view.name)) {
                return this.client.ui.reply(ctx, 'warn', `Playlist \`${ctx.options.view.name}\` does not exist.`);
            }

            const playlist = this.client.playlists.get(guild.id, `${ctx.options.view.name}.tracks`);
            const trackList = playlist.map(x => `${playlist.indexOf(x) + 1}: [${x.title}](${x.url})`).join('\n');

            if (!trackList) {
                return this.client.ui.reply(ctx, 'warn', `Playlist \`${ctx.options.view.name}\` is empty.`);
            }

            await this.client.ui.custom(
                ctx,
                ':page_with_curl:',
                ctx.guild.members.me.displayColor !== 0 ? ctx.guild.members.me.displayColor : null,
                trackList,
                `${ctx.options.view.name}`,
                `${playlist.length} ${playlist.length === 1 ? 'track' : 'tracks'}`
            );

            break;
        }

        case 'new': {
            try {
                const playlistData = {
                    user: ctx.member.user.id,
                    date_created: Math.floor(Date.now() / 1000),
                    tracks: []
                };

                if (this.client.playlists.has(guild.id, ctx.options.new.name)) {
                    return this.client.ui.reply(ctx, 'warn', `Playlist \`${ctx.options.new.name}\` already exists.`);
                } else {
                    await this.client.playlists.set(guild.id, playlistData, ctx.options.new.name);
                }
                return this.client.ui.reply(ctx, 'ok', `Created new playlist \`${ctx.options.new.name}\`.`);
            } catch (err) {
                this.client.ui.reply(ctx, 'error', `Unable to create the playlist \`${ctx.options.new.name}\`. ${err.message}`);
            }

            break;
        }

        case 'clone': {
            try {
                if (!this.client.playlists.has(guild.id, ctx.options.clone.name)) {
                    return this.client.ui.reply(ctx, 'warn', `Playlist \`${ctx.options.clone.name}\` does not exists.`);
                } else {
                    const original = this.client.playlists.get(guild.id, ctx.options.clone.name);
                    await this.client.playlists.set(guild.id, original, ctx.options.clone.clone_name ?? `${ctx.options.clone.name} - Copy`);
                }
                return this.client.ui.reply(ctx, 'ok', `Cloned playlist \`${ctx.options.clone.name}\` into new playlist \`${ctx.options.clone.clone_name ?? `${ctx.options.clone.name} - Copy`}\`.`);
            } catch (err) {
                this.client.ui.reply(ctx, 'error', `Unable to create the playlist \`${ctx.options.clone.name}\`. ${err.message}`);
            }

            break;
        }

        case 'remove': {
            if (!args.name) {
                return this.client.ui.usage(ctx, 'playlist remove <name> <tracks...>');
            }

            break;

            // Work in progress... stay tuned!
            try {
                if (this.client.playlists.has(guild.id, args.name)) {
                    return this.client.ui.reply(ctx, 'warn', `Playlist \`${args.name}\` does not exist.`);
                } else {
                    await this.client.playlists.set(guild.id, [], args.name);
                }
                return this.client.ui.reply(ctx, 'ok', `Created new playlist \`${args.name}\`.`);
            } catch (err) {
                this.client.ui.reply(ctx, 'error', `Unable to create the playlist \`${args.name}\`. ${err.message}`);
            }

            break;
        }

        case 'show': {
            const playlists = this.client.playlists.get(guild.id);
            let playlistMap;

            for (const [k, [v]] of Object.entries(playlists)) {
                playlistMap += `**${k}**\n${v.map(x => `${x.tracks?.length ?? 0} track(s)\nCreator: <@!${x.user}>\nDate: <t:${x.date_created}:F>\n\n`)}`;
            }

            if (!playlistMap) {
                return this.client.ui.reply(ctx, 'warn', 'There are no playlists on this server.');
            }

            const embed = new EmbedBuilder()
                .setColor(ctx.guild.members.me.displayColor !== 0 ? ctx.guild.members.me.displayColor : null)
                .setAuthor({
                    name: ctx.guild.name,
                    iconURL: ctx.guild.iconURL()
                })
                .setTitle(':page_with_curl: Playlists')
                .setDescription(`${playlistMap}`)
                .setFooter({
                    text: `${Object.keys(playlists).size} playlist(s)`
                });

            ctx.channel.send({ embeds: [embed] });

            break;
        }
        }
    }
}

module.exports = CommandPlaylist;
