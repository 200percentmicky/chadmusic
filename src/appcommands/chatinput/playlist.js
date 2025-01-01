/// ChadMusic - The Chad Music Bot
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

const { SlashCommand, CommandOptionType, ChannelType } = require('slash-create');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const ytdl = require('@distube/ytdl-core');
const _ = require('lodash');
const CMError = require('../../lib/CMError');

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
                            required: true,
                            autocomplete: true
                        },
                        {
                            type: CommandOptionType.STRING,
                            name: 'track',
                            description: 'A track to add to the playlist.'
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
                            required: true,
                            autocomplete: true
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
                            required: true,
                            autocomplete: true
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
                            required: true,
                            autocomplete: true
                        },
                        {
                            type: CommandOptionType.NUMBER,
                            name: 'index_or_start',
                            description: 'The track or the starting position to remove multiple tracks from the playlist.',
                            required: true
                        },
                        {
                            type: CommandOptionType.NUMBER,
                            name: 'end',
                            description: 'The ending position to remove multiple tracks.'
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
                    name: 'view',
                    description: 'List all tracks in a playlist.',
                    options: [
                        {
                            type: CommandOptionType.STRING,
                            name: 'name',
                            description: 'The name of the playlist to view.',
                            required: true,
                            autocomplete: true
                        }
                    ]
                }
            ]
        });

        this.filePath = __filename;
    }

    async autocomplete (ctx) {
        const query = ctx.options[ctx.subcommands[0]][ctx.focused];
        try {
            const playlists = await this.client.playlists.get(ctx.guildID);

            const playlistMap = [];
            for (const [k, v] of Object.entries(playlists)) {
                playlistMap.push({ name: k, value: v });
            }

            const filter = playlistMap.filter(x => x.name.startsWith(query));
            return ctx.sendResults(filter.map(x => ({ name: `${x.name} - ${x.value.tracks?.length} track${x.value.tracks?.length === 1 ? '' : 's'}`, value: `${x.name}` })));
        } catch (err) {
            if (!this.client.playlists.has(ctx.guildID)) {} // eslint-disable-line no-empty, brace-style
            else if (err) {
                this.client.logger.error(`Unable to gather autocomplete data.\n${err.stack}`);
            }
            return ctx.sendResults([]);
        }
    }

    async run (ctx) {
        if (ctx.channel.type === ChannelType.DM) {
            throw new CMError('NO_DMS_ALLOWED');
        }

        const guild = this.client.guilds.cache.get(ctx.guildID);
        const channel = await guild.channels.fetch(ctx.channelID);
        const member = await guild.members.fetch(ctx.user.id);

        if (!this.client.utils.isDJ(channel, member)) {
            return this.client.ui.sendPrompt(ctx, 'NO_DJ');
        }

        await ctx.defer();

        await this.client.playlists.ensure(guild.id, {});

        switch (ctx.subcommands[0]) {
        /* eslint-disable no-useless-escape */
        case 'add': {
            const player = this.client.player.getQueue(guild);

            if (!this.client.playlists.has(guild.id, ctx.options.add.name)) {
                return this.client.ui.reply(ctx, 'warn', `Playlist \`${ctx.options.add.name}\` does not exist.`);
            }

            if (this.client.playlists.get(guild.id, ctx.options.add.name).user !== member.user.id) {
                if (channel.permissionsFor(member.user.id).has(PermissionFlagsBits.Administrator)) {} // eslint-disable-line no-empty, brace-style
                else return this.client.ui.reply(ctx, 'no', `\`${ctx.options.add.name}\` is not your playlist.`);
            }

            if (ctx.options.add.track ?? player) {
                try {
                    let track;

                    try {
                        track = await ytdl.getInfo(ctx.options.add.track ?? player.songs[0].url);
                    } catch {
                        track = await this.client.player.ytdlp.resolve(ctx.options.add.track ?? player.songs[0].url, {
                            member
                        });
                    }

                    const trackInfo = {
                        title: track.videoDetails?.title ?? track.name,
                        url: track.videoDetails?.video_url ?? track.url,
                        date_added: Math.floor(Date.now() / 1000)
                    };

                    if (!this.client.utils.hasURL(ctx.options.add.track ?? player.songs[0].url) || !track) {
                        return this.client.ui.reply(ctx, 'error', 'The track must be a URL.');
                    }

                    const trackExists = _.find(this.client.playlists.get(guild.id, `${ctx.options.add.name}.tracks`), (obj) => {
                        return obj.url === trackInfo.url;
                    });

                    if (trackExists) {
                        return this.client.ui.reply(ctx, 'warn', `**${trackInfo.title}** already exist in the playlist \`${ctx.options.add.name}\``);
                    } else {
                        await this.client.playlists.push(guild.id, trackInfo, `${ctx.options.add.name}.tracks`, false);
                    }

                    this.client.ui.reply(ctx, 'ok', `Added **${trackInfo.title}** to the playlist \`${ctx.options.add.name}\`.`);
                } catch (err) {
                    this.client.ui.reply(ctx, 'error', `Unable to add the track to the playlist \`${ctx.options.add.name}\`. ${err.message}`);
                }
            } else if (!player && !ctx.options.add.name) {
                return this.client.ui.sendPrompt(ctx, 'NOT_PLAYING');
            }

            break;
        }
        /* eslint-enable no-useless-escape */

        case 'delete': {
            if (!this.client.playlists.has(guild.id, ctx.options.delete.name)) {
                return this.client.ui.reply(ctx, 'warn', `Playlist \`${ctx.options.delete.name}\` does not exist.`);
            }

            if (this.client.playlists.get(guild.id, ctx.options.delete.name).user !== member.user.id) {
                if (channel.permissionsFor(member.user.id).has(PermissionFlagsBits.Administrator)) {} // eslint-disable-line no-empty, brace-style
                else return this.client.ui.reply(ctx, 'no', `\`${ctx.options.delete.name}\` is not your playlist.`);
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
            const trackList = playlist.map(x => `**${playlist.indexOf(x) + 1}:** [${x.title}](${x.url}) (<t:${x.date_added}:f>)`).join('\n\n');

            if (!trackList) {
                return this.client.ui.reply(ctx, 'warn', `Playlist \`${ctx.options.view.name}\` is empty.`);
            }

            await this.client.ui.custom(
                ctx,
                ':page_with_curl:',
                guild.members.me.displayColor !== 0 ? guild.members.me.displayColor : null,
                trackList,
                `${ctx.options.view.name}`,
                `${playlist.length} ${playlist.length === 1 ? 'track' : 'tracks'}`
            );

            break;
        }

        case 'new': {
            try {
                const playlistData = {
                    user: member.user.id,
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

        case 'purge': {
            const yesButton = new ButtonBuilder()
                .setStyle(ButtonStyle.Success)
                .setLabel('Yes')
                .setEmoji('✔')
                .setCustomId('slash_yes_playlist_purge');

            const noButton = new ButtonBuilder()
                .setStyle(ButtonStyle.Danger)
                .setLabel('No')
                .setEmoji('✖')
                .setCustomId('slash_no_playlist_purge');

            const buttonRow = new ActionRowBuilder().addComponents(yesButton, noButton);

            await this.client.ui.reply(ctx, 'warn', 'Are you sure you want to delete all playlists for this server? This action cannot be undone!', 'Deleting All Playlists', null, null, [buttonRow]);

            ctx.registerComponent('slash_yes_playlist_purge', async (btnCtx) => {
                if (ctx.user.id !== btnCtx.user.id) {
                    await btnCtx.defer(true);
                    return this.client.ui.reply(btnCtx, 'no', 'That component can only be used by the user that ran this command.');
                }

                try {
                    await this.client.playlists.delete(guild.id);
                    btnCtx.acknowledge();
                    btnCtx.delete();
                    return this.client.ui.reply(ctx, 'ok', 'All playlists on the server have been deleted.');
                } catch (err) {
                    return this.client.ui.reply(ctx, 'error', `Unable to delete all playlists. ${err.message}`);
                }
            }, 300 * 1000);

            ctx.registerComponent('slash_no_playlist_purge', async (btnCtx) => {
                if (ctx.user.id !== btnCtx.user.id) {
                    await btnCtx.defer(true);
                    return this.client.ui.reply(btnCtx, 'no', 'That component can only be used by the user that ran this command.');
                }

                btnCtx.acknowledge();
                btnCtx.delete();
            }, 300 * 1000);

            break;
        }

        case 'clone': {
            try {
                const newName = ctx.options.clone.clone_name ?? `${ctx.options.clone.name} - Copy`;
                if (!this.client.playlists.has(guild.id, ctx.options.clone.name)) {
                    return this.client.ui.reply(ctx, 'warn', `Playlist \`${ctx.options.clone.name}\` does not exists.`);
                } else {
                    const original = this.client.playlists.get(guild.id, ctx.options.clone.name);

                    if (this.client.playlists.has(guild.id, newName)) {
                        return this.client.ui.reply(ctx, 'warn', `Playlist \`${ctx.options.clone.name} - Copy\` already exists. Please choose a different name.`);
                    }

                    await this.client.playlists.set(guild.id, original, newName);
                    await this.client.playlists.set(guild.id, member.user.id, `${newName}.user`);
                    await this.client.playlists.set(guild.id, `${Math.floor(Date.now() / 1000)}`, `${newName}.date_created`);
                }
                return this.client.ui.reply(ctx, 'ok', `Cloned playlist \`${ctx.options.clone.name}\` into new playlist \`${newName}\`.`);
            } catch (err) {
                this.client.ui.reply(ctx, 'error', `Unable to clone the playlist \`${ctx.options.clone.name}\`. ${err.message}`);
            }

            break;
        }

        case 'remove': {
            if (!this.client.playlists.has(guild.id, ctx.options.remove.name)) {
                return this.client.ui.reply(ctx, 'warn', `Playlist \`${ctx.options.remove.name}\` does not exist.`);
            }

            if (this.client.playlists.get(guild.id, ctx.options.remove.name).user !== member.user.id) {
                if (channel.permissionsFor(member.user.id).has(PermissionFlagsBits.Administrator)) {} // eslint-disable-line no-empty, brace-style
                else return this.client.ui.reply(ctx, 'no', `\`${ctx.options.remove.name}\` is not your playlist.`);
            }

            try {
                // This is more or less a copy and paste of the remove command lol
                const playlist = this.client.playlists.get(guild.id, ctx.options.remove.name);

                if (ctx.options.remove.end) {
                    const start = parseInt(ctx.options.remove.index_or_start);
                    const end = parseInt(ctx.options.remove.end);

                    if (isNaN(start)) return this.client.ui.reply(ctx, 'error', 'Starting index position must be a number.');
                    if (isNaN(end)) return this.client.ui.reply(ctx, 'error', 'Ending index position must be a number.');

                    const tracks = _.slice(playlist.tracks, start - 1, end);
                    const changedList = _.pullAll(playlist.tracks, tracks);

                    this.client.playlists.set(guild.id, changedList, `${ctx.options.remove.name}.tracks`);

                    return this.client.ui.reply(ctx, 'ok', `**${tracks.length}** track${tracks.length === 1 ? '' : 's'} removed from \`${ctx.options.remove.name}\`.`);
                } else {
                    if (isNaN(ctx.options.remove.index_or_start)) return this.client.ui.reply(ctx, 'error', 'Track index must be a number.');

                    const track = playlist.tracks[ctx.options.remove.index_or_start - 1];

                    if (!_.find(playlist.tracks, track) || ctx.options.remove.index_or_start < 1 || ctx.options.remove.index_or_start > playlist.tracks.length) {
                        return this.client.ui.reply(ctx, 'warn', 'That entry does not exist.');
                    }

                    const changedList = _.remove(playlist.tracks, (obj) => {
                        return obj.url !== track?.url;
                    });
                    this.client.playlists.set(guild.id, changedList, `${ctx.options.remove.name}.tracks`);

                    return this.client.ui.reply(ctx, 'ok', `Removed **${track?.title}** from \`${ctx.options.remove.name}\`.`);
                }
            } catch (err) {
                this.client.ui.reply(ctx, 'error', `Unable to remove any tracks from the playlist \`${ctx.options.remove.name}\`. ${err.message}`);
            }
            break;
        }

        case 'show': {
            const playlists = this.client.playlists.get(guild.id);
            const playlistMap = [];

            for (const [k, v] of Object.entries(playlists)) {
                playlistMap.push({
                    name: `${k}`,
                    value: `${v.tracks?.length ?? 0} track${v.tracks?.length === 1 ? '' : 's'} - <@!${v.user}> (<t:${v.date_created}:f>)`
                });
            }

            const embed = new EmbedBuilder()
                .setColor(guild.members.me.displayColor !== 0 ? guild.members.me.displayColor : null)
                .setAuthor({
                    name: guild.name,
                    iconURL: guild.iconURL()
                })
                .setTitle(':page_with_curl: Playlists')
                .setDescription(`${playlistMap.length > 0 ? `${playlistMap.map(x => `* **${x.name}** - ${x.value}`).join('\n')}` : `${process.env.EMOJI_WARN} There are no playlists on this server. Run \`/playlist new <name>\` to create one.`}`)
                .setFooter({
                    text: `${Object.entries(playlists).length} playlist${Object.entries(playlists).length === 1 ? '' : 's'}`
                });

            ctx.send({ embeds: [embed] });
            break;
        }
        }
    }
}

module.exports = CommandPlaylist;
