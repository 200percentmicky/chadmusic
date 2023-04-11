/**
 *  ChadMusic - The Chad Music Bot
 *  Copyright (C) 2023  Micky D. | @200percentmicky | Micky-kun#3836
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

const { SlashCommand, CommandOptionType } = require('slash-create');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const { splitBar } = require('string-progressbar');
const { toMilliseconds } = require('colon-notation');
const { isSameVoiceChannel } = require('../../modules/isSameVoiceChannel');
const Genius = require('genius-lyrics');

class CommandPlayer extends SlashCommand {
    constructor (creator) {
        super(creator, {
            name: 'player',
            description: 'Manages the player in this server.',
            options: [
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'nowplaying',
                    description: 'Shows the currently playing song on this server.'
                },
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'join',
                    description: "Summons the bot to the voice channel you're in."
                },
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'leave',
                    description: 'Disconnects the bot from the voice channel'
                },
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'pause',
                    description: 'Pauses the player.'
                },
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'resume',
                    description: 'Resumes the player, if the player is paused.'
                },
                {
                    type: CommandOptionType.SUB_COMMAND_GROUP,
                    name: 'volume',
                    description: "Manages the player's volume.",
                    options: [
                        {
                            type: CommandOptionType.SUB_COMMAND,
                            name: 'set',
                            description: 'Sets the volume of the player.',
                            options: [
                                {
                                    type: CommandOptionType.INTEGER,
                                    name: 'value',
                                    description: 'The value to set.',
                                    min_value: 0,
                                    required: true
                                }
                            ]
                        },
                        {
                            type: CommandOptionType.SUB_COMMAND,
                            name: 'view',
                            description: 'Shows the current volume of the player.'
                        }
                    ]
                },
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'earrape',
                    description: "Sets the player's volume to 69420% 😂👌👌. Reverts to defaults if the player's volume is over 5000%."
                },
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'seek',
                    description: 'Sets the playing time of the track to a new position.',
                    options: [
                        {
                            type: CommandOptionType.STRING,
                            name: 'time',
                            description: 'The time of the track to seek to.',
                            required: true
                        }
                    ]
                },
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'startover',
                    description: 'Restarts the currently playing song.'
                },
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'repeat',
                    description: 'Toggles repeat mode for the player.',
                    options: [
                        {
                            type: CommandOptionType.STRING,
                            name: 'mode',
                            description: 'The mode to apply for repeat mode.',
                            choices: [
                                {
                                    name: 'off',
                                    value: '0'
                                },
                                {
                                    name: 'song',
                                    value: '1'
                                },
                                {
                                    name: 'queue',
                                    value: '2'
                                }
                            ],
                            required: true
                        }
                    ]
                },
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'lyrics',
                    description: 'Retrieves lyrics from the playing track or from search query.',
                    options: [
                        {
                            type: CommandOptionType.STRING,
                            name: 'query',
                            description: 'The search query to find lyrics.'
                        }
                    ]
                },
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'bindchannel',
                    description: 'Changes the player\'s currently binded text or voice channel to a different one.',
                    options: [
                        {
                            type: CommandOptionType.CHANNEL,
                            name: 'channel',
                            description: 'The new text or voice channel to bind to.',
                            required: true
                        }
                    ]
                },
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'grab',
                    description: 'Sends the currently playing song as a direct message.'
                },
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'stop',
                    description: 'Destroys the player.'
                }
            ]
        });

        this.filePath = __filename;
    }

    async run (ctx) {
        const client = this.creator.client;
        const guild = client.guilds.cache.get(ctx.guildID);
        const channel = await guild.channels.fetch(ctx.channelID);
        const _member = await guild.members.fetch(ctx.member.id);

        const djMode = client.settings.get(ctx.guildID, 'djMode');
        const djRole = client.settings.get(ctx.guildID, 'djRole');
        const dj = _member.roles.cache.has(djRole) || channel.permissionsFor(_member.user.id).has(PermissionsBitField.Flags.ManageChannels);
        if (djMode) {
            if (ctx.subcommands[0] === 'grab') {} // eslint-disable-line no-empty, brace-style
            else if (!dj) return this.client.ui.sendPrompt(ctx, 'DJ_MODE');
        }

        const vc = _member.voice.channel;
        const textChannel = client.settings.get(ctx.guildID, 'textChannel');
        if (textChannel) {
            if (textChannel !== channel.id) {
                return this.client.ui.sendPrompt(ctx, 'WRONG_TEXT_CHANNEL_MUSIC', vc.id);
            }
        }

        if (!vc) return this.client.ui.sendPrompt(ctx, 'NOT_IN_VC');

        const queue = this.client.player.getQueue(guild);

        switch (ctx.subcommands[0]) {
        case 'nowplaying': {
            const currentVc = client.vc.get(vc);
            if (!queue || !currentVc) return this.client.ui.sendPrompt(ctx, 'NOT_PLAYING');
            else if (!isSameVoiceChannel(this.client, _member, vc)) return this.client.ui.sendPrompt(ctx, 'ALREADY_SUMMONED_ELSEWHERE');

            const song = queue.songs[0];
            const total = song.duration;
            const current = queue.currentTime;
            const author = song.uploader;

            let songTitle = song.name;
            if (songTitle.length > 256) songTitle = song.name.substring(0, 252) + '...';

            let progressBar;
            if (!song.isLive) progressBar = splitBar(total, current, 17)[0];
            const duration = song.isLive ? '🔴 **Live**' : `${queue.formattedCurrentTime} [${progressBar}] ${song.formattedDuration}`;
            let embed = new EmbedBuilder()
                .setColor(guild.members.me.displayColor !== 0 ? guild.members.me.displayColor : null)
                .setAuthor({
                    name: `Currently playing in ${currentVc.channel.name}`,
                    iconURL: guild.iconURL({ dynamic: true })
                })
                .setDescription(`${duration}`)
                .setTitle(`${songTitle}`)
                .setURL(song.url);

            const thumbnailSize = await this.client.settings.get(guild.id, 'thumbnailSize');

            switch (thumbnailSize) {
            case 'small': {
                embed.setThumbnail(song.thumbnail);
                break;
            }
            case 'large': {
                embed.setImage(song.thumbnail);
                break;
            }
            }

            let nowPlayingFields = [];

            if (song.age_restricted) {
                nowPlayingFields.push({
                    name: ':underage: Explicit',
                    value: 'This track is **Age Restricted**'
                });
            }

            if (song.isFile) {
                nowPlayingFields.push({
                    name: '📎 File',
                    value: `${song.codec}`
                });
            }

            if (author.name) {
                nowPlayingFields.push({
                    name: ':arrow_upper_right: Uploader',
                    value: `[${author.name}](${author.url})`
                });
            }

            if (song.station) {
                nowPlayingFields.push({
                    name: ':tv: Station', value: `${song.station}`
                });
            }

            if (song.metadata?.silent && song.user.id !== _member.user.id) {
                embed = new EmbedBuilder()
                    .setColor(guild.members.me.displayColor !== 0 ? guild.members.me.displayColor : null)
                    .setAuthor({
                        name: `Currently playing in ${currentVc.channel.name}`,
                        iconURL: guild.iconURL({ dynamic: true })
                    });

                nowPlayingFields = [];
                nowPlayingFields.push({
                    name: '🔇 Silent',
                    value: 'This track is hidden. The user that added this track can reveal it.'
                });
            } else if (song.metadata?.silent) {
                nowPlayingFields.push({
                    name: '🔇 Silent',
                    value: 'This track is hidden.'
                });
            }

            if (queue.paused) {
                nowPlayingFields.push({
                    name: '⏸ Paused',
                    value: 'Type `/player resume` to resume playback.'
                });
            }

            const volumeEmoji = () => {
                const volume = queue.volume;
                const volumeIcon = {
                    50: '🔈',
                    100: '🔉',
                    150: '🔊'
                };
                if (volume >= 175) return '🔊😭👌';
                return volumeIcon[Math.round(volume / 50) * 50];
            };

            nowPlayingFields.push({
                name: ':raising_hand: Requested by',
                value: `${song.user}`,
                inline: true
            });
            nowPlayingFields.push({
                name: `${volumeEmoji()} Volume`,
                value: `${queue.volume}%`,
                inline: true
            });
            nowPlayingFields.push({
                name: '📢 Filters',
                value: `${queue.filters.filters.length > 0 ? `${queue.formattedFilters.map(x => `**${x.name}:** ${x.value}`).join('\n')}` : 'None'}`
            });

            embed
                .addFields(nowPlayingFields)
                .setTimestamp();

            return ctx.send({ embeds: [embed] });
        }

        case 'join': {
            const currentVc = this.client.vc.get(vc);
            if (currentVc) {
                if (vc.id !== currentVc.id) return this.client.ui.reply(ctx, 'error', 'I\'m currently binded to a different voice channel.');
                else return this.client.ui.reply(ctx, 'info', 'I\'m already in a voice channel. Let\'s get this party started!');
            } else {
                try {
                    this.client.vc.join(vc);
                } catch (err) {
                    const permissions = vc.permissionsFor(this.client.user.id).has(PermissionsBitField.Flags.Connect);
                    if (!permissions) return this.client.ui.sendPrompt(ctx, 'MISSING_CONNECT', vc.id);
                    else if (err.name.includes('[VOICE_FULL]')) return this.client.ui.sendPrompt(ctx, 'FULL_CHANNEL');
                    else return this.client.ui.reply(ctx, 'error', `An error occured connecting to the voice channel. ${err.message}`);
                }

                if (vc.type === 'stage') {
                    const stageMod = vc.permissionsFor(this.client.user.id).has(PermissionsBitField.StageModerator);
                    if (!stageMod) {
                        try {
                            await guild.members.me.voice.setRequestToSpeak(true);
                        } catch {
                            await guild.members.me.voice.setSuppressed(false);
                        }
                    } else {
                        await guild.members.me.voice.setSuppressed(false);
                    }
                }
                return this.client.ui.custom(ctx, '📥', 0x77B255, `Joined <#${vc.id}>`);
            }
        }

        case 'leave': {
            const currentVc = this.client.vc.get(vc);
            if (!currentVc) {
                return this.client.ui.reply(ctx, 'error', 'I\'m not in any voice channel.');
            }

            if (vc.members.size <= 2 || dj) {
                if (queue) {
                    this.client.player.stop(guild);
                }
                this.client.vc.leave(guild);
                return this.client.ui.custom(ctx, '📤', 0xDD2E44, `Left <#${vc.id}>`);
            } else {
                return this.client.ui.sendPrompt(ctx, 'NOT_ALONE');
            }
        }

        case 'pause': {
            const currentVc = this.client.vc.get(vc);
            if (!queue || !currentVc) return this.client.ui.sendPrompt(ctx, 'NOT_PLAYING');
            else if (!isSameVoiceChannel(this.client, _member, vc)) return this.client.ui.sendPrompt(ctx, 'ALREADY_SUMMONED_ELSEWHERE');

            if (vc.members.size <= 2 || dj) {
                if (queue.paused) return this.client.ui.reply(ctx, 'warn', 'The player is already paused.', null, "Type '/player resume' to resume playback.");
                await this.client.player.pause(guild);
                return this.client.ui.custom(ctx, '⏸', process.env.COLOR_INFO, 'Paused', null, "Type '/player resume' to resume playback.");
            } else {
                return this.client.ui.sendPrompt(ctx, 'NOT_ALONE');
            }
        }

        case 'resume': {
            const currentVc = this.client.vc.get(vc);
            if (!queue || !currentVc) return this.client.ui.sendPrompt(ctx, 'NOT_PLAYING');
            else if (!isSameVoiceChannel(this.client, _member, vc)) return this.client.ui.sendPrompt(ctx, 'ALREADY_SUMMONED_ELSEWHERE');

            if (vc.members.size <= 2 || dj) {
                if (!queue.paused) return this.client.ui.reply(ctx, 'warn', 'The player is not paused.');
                await queue.resume();
                return this.client.ui.custom(ctx, '▶', process.env.COLOR_INFO, 'Resuming playback...');
            } else {
                return this.client.ui.sendPrompt(ctx, 'NOT_ALONE');
            }
        }

        case 'volume': {
            const currentVc = this.client.vc.get(vc);
            if (!queue || !currentVc) return this.client.ui.sendPrompt(ctx, 'NOT_PLAYING');
            else if (!isSameVoiceChannel(this.client, _member, vc)) return this.client.ui.sendPrompt(ctx, 'ALREADY_SUMMONED_ELSEWHERE');

            const volume = queue.volume;
            if (ctx.subcommands[1] === 'view') {
                const volumeEmoji = () => {
                    const volumeIcon = {
                        50: '🔈',
                        100: '🔉',
                        150: '🔊'
                    };
                    if (volume >= 175) return '🔊😭👌';
                    return volumeIcon[Math.round(volume / 50) * 50];
                };
                return this.client.ui.custom(ctx, volumeEmoji(), process.env.COLOR_INFO, `Current Volume: **${volume}%**`);
            } else {
                let newVolume = parseInt(ctx.options.volume.set?.value);
                const allowFreeVolume = await this.client.settings.get(guild.id, 'allowFreeVolume');
                if (allowFreeVolume === (false || undefined) && newVolume > 200) newVolume = 200;
                this.client.player.setVolume(guild.id, newVolume);

                if (newVolume >= 201) {
                    return this.client.ui.reply(
                        ctx,
                        'warn',
                        `Volume has been set to **${newVolume}%**.`,
                        null,
                        'Volumes exceeding 200% may cause damage to self and equipment.'
                    );
                } else {
                    return this.client.ui.reply(ctx, 'ok', `Volume has been set to **${newVolume}%**.`);
                }
            }
        }

        case 'earrape': {
            const currentVc = this.client.vc.get(vc);
            if (!queue || !currentVc) return this.client.ui.sendPrompt(ctx, 'NOT_PLAYING');
            else if (!isSameVoiceChannel(this.client, _member, vc)) return this.client.ui.sendPrompt(ctx, 'ALREADY_SUMMONED_ELSEWHERE');

            const earrape = 69420; // 😂👌👌💯
            const volume = queue.volume;
            const defaultVolume = this.client.settings.get(guild.id, 'defaultVolume', 100);
            if (volume >= 5000) {
                this.client.player.setVolume(guild, defaultVolume);
                return this.client.ui.reply(ctx, 'ok', `Volume has been set to **${defaultVolume}%**. 😌😏`);
            } else {
                this.client.player.setVolume(guild, earrape);
                return this.client.ui.reply(
                    ctx,
                    'warn',
                    `🔊💢💀 Volume has been set to **${earrape}%**. 😂👌👌`,
                    null,
                    'Volumes exceeding 200% may cause damage to self and equipment.'
                );
            }
        }

        case 'seek': {
            const currentVc = this.client.vc.get(vc);
            if (!queue || !currentVc) return this.client.ui.sendPrompt(ctx, 'NOT_PLAYING');
            else if (!isSameVoiceChannel(this.client, _member, vc)) return this.client.ui.sendPrompt(ctx, 'ALREADY_SUMMONED_ELSEWHERE');

            if (vc.members.size <= 2 || dj) {
                try {
                    const time = toMilliseconds(ctx.options.seek.time);
                    this.client.player.seek(guild, parseInt(Math.floor(time / 1000)));
                } catch {
                    this.client.ui.reply(ctx, 'error', 'Track time must be in colon notation or in milliseconds. Example: `4:30`');
                }
                return this.client.ui.reply(ctx, 'info', `Seeking to \`${ctx.options.seek.time}\`...`);
            } else {
                return this.client.ui.sendPrompt(ctx, 'NOT_ALONE');
            }
        }

        case 'startover': {
            const currentVc = this.client.vc.get(vc);
            if (!queue || !currentVc) return this.client.ui.sendPrompt(ctx, 'NOT_PLAYING');
            else if (!isSameVoiceChannel(this.client, _member, vc)) return this.client.ui.sendPrompt(ctx, 'ALREADY_SUMMONED_ELSEWHERE');

            if (vc.members.size <= 2 || dj) {
                this.client.player.seek(guild, 0);
                return this.client.ui.reply(ctx, 'info', 'Restarting song...');
            } else {
                return this.client.ui.sendPrompt(ctx, 'NOT_ALONE');
            }
        }

        case 'repeat': {
            const currentVc = this.client.vc.get(vc);
            if (!queue || !currentVc) return this.client.ui.sendPrompt(ctx, 'NOT_PLAYING');
            else if (!isSameVoiceChannel(this.client, _member, vc)) return this.client.ui.sendPrompt(ctx, 'ALREADY_SUMMONED_ELSEWHERE');

            if (vc.members.size <= 2 || dj) {
                const mode = parseInt(ctx.options.repeat.mode);
                const selectedMode = {
                    1: '🔂 Repeat Song',
                    2: '🔁 Repeat Queue'
                };

                await this.client.player.setRepeatMode(guild, mode);
                return this.client.ui.reply(ctx, 'ok', mode !== 0
                    ? `Enabled repeat to **${selectedMode[mode]}**`
                    : 'Repeat mode has been disabled.'
                );
            } else {
                return this.client.ui.sendPrompt(ctx, 'NOT_ALONE');
            }
        }

        case 'lyrics': {
            const geniusClient = new Genius.Client(process.env.GENIUS_TOKEN);
            const queue = this.client.player.getQueue(ctx.guild);
            const query = queue?.songs[0]?.name ?? ctx.options.lyrics.query;

            if (!queue && !query) {
                return this.client.ui.reply(ctx, 'warn', 'Nothing is currently playing in this server. You can use `lyrics [query]` to manually search for lyrics.');
            }

            await ctx.defer();

            try {
                const songSearch = await geniusClient.songs.search(query);
                const songLyrics = await songSearch[0].lyrics();

                if (songLyrics.length > 4096) {
                    // Since Genius likes to give you weird results, it most likely didn't
                    // retrieve lyrics causing the embed to exceed its limits.
                    return this.client.ui.reply(ctx, 'error', 'Unable to retrieve lyrics from currently playing song. Try manually searching for the song using `lyrics [query]`.');
                }

                const embed = new EmbedBuilder()
                    .setColor(ctx.guild.members.me.displayColor !== 0 ? ctx.guild.members.me.displayColor : null)
                    .setAuthor({
                        name: songSearch[0].artist.name,
                        url: songSearch[0].artist.url,
                        iconURL: songSearch[0].artist.image
                    })
                    .setTitle(songSearch[0].title)
                    .setURL(songSearch[0].url)
                    .setDescription(`${songLyrics}`)
                    .setThumbnail(songSearch[0].image)
                    .setFooter({
                        text: `${ctx.member.user.tag} • Powered by Genius API. (https://genius.com)`,
                        iconURL: ctx.member.user.avatarURL({ dynamic: true })
                    });
                return ctx.send({ embeds: [embed] });
            } catch (err) {
                return this.client.ui.reply(ctx, 'error', err.message, 'Genius API Error');
            }
        }

        case 'bindchannel': {
            const currentVc = this.client.vc.get(vc);
            if (!queue || !currentVc) return this.client.ui.sendPrompt(ctx, 'NOT_PLAYING');
            else if (!isSameVoiceChannel(this.client, _member, vc)) return this.client.ui.sendPrompt(ctx, 'ALREADY_SUMMONED_ELSEWHERE');

            if (dj) {
                const newBindChannel = await guild.channels.fetch(ctx.options.bindchannel.channel);
                queue.textChannel = newBindChannel;
                return this.client.ui.reply(ctx, 'ok', `Got it. Now binded to <#${newBindChannel.id}>`);
            } else {
                return this.client.ui.sendPrompt(ctx, 'NO_DJ');
            }
        }

        case 'grab': {
            const currentVc = this.client.vc.get(vc);
            if (!queue || !currentVc) return this.client.ui.sendPrompt(ctx, 'NOT_PLAYING');
            else if (!isSameVoiceChannel(this.client, _member, vc)) return this.client.ui.sendPrompt(ctx, 'ALREADY_SUMMONED_ELSEWHERE');

            await ctx.defer(true);

            const song = this.client.player.getQueue(ctx.guild).songs[0];

            let songTitle = song.name;
            if (songTitle.length > 256) songTitle = song.name.substring(0, 252) + '...';

            const embed = new EmbedBuilder()
                .setColor(guild.members.me.displayColor !== 0 ? guild.members.me.displayColor : null)
                .setAuthor({
                    name: 'Song saved!',
                    iconURL: 'https://media.discordapp.net/attachments/375453081631981568/673819399245004800/pOk2_2.png'
                })
                .setTitle(`${songTitle}`)
                .setURL(song.url)
                .addFields({
                    name: 'Duration',
                    value: `${song.formattedDuration}`
                })
                .setTimestamp();

            const thumbnailSize = await this.client.settings.get(guild.id, 'thumbnailSize');

            switch (thumbnailSize) {
            case 'small': {
                embed.setThumbnail(song.thumbnail);
                break;
            }
            case 'large': {
                embed.setImage(song.thumbnail);
                break;
            }
            }

            try {
                await _member.user.send({ embeds: [embed] });
                return this.client.ui.reply(ctx, 'ok', 'Saved! Check your DMs. 📩');
            } catch {
                return this.client.ui.reply(ctx, 'error', 'Cannot save this song because you\'re currently not accepting Direct Messages.');
            }
        }

        case 'stop': {
            const currentVc = this.client.vc.get(vc);
            if (!this.client.player.getQueue(guild) || !currentVc) return this.client.ui.sendPrompt(ctx, 'NOT_PLAYING');
            else if (!isSameVoiceChannel(this.client, _member, vc)) return this.client.ui.sendPrompt(ctx, 'ALREADY_SUMMONED_ELSEWHERE');

            if (vc.members.size <= 2 || dj) {
                this.client.player.stop(guild);
                this.client.vc.leave(guild);
                return this.client.ui.custom(ctx, '⏹', process.env.COLOR_INFO, 'Stopped the player and cleared the queue.');
            } else {
                return this.client.ui.sendPrompt(ctx, 'NOT_ALONE');
            }
        }
        }
    }
}

module.exports = CommandPlayer;
