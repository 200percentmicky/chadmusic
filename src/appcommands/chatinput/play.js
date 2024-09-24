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

const { SlashCommand, CommandOptionType, ChannelType } = require('slash-create');
const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    PermissionsBitField,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder
} = require('discord.js');
const iheart = require('iheart');
const AutoComplete = require('youtube-autocomplete');
const { hasURL } = require('../../lib/hasURL');
const ffprobe = require('ffprobe');
const ffprobeStatic = require('ffprobe-static');
const { toColonNotation } = require('colon-notation');
const CMError = require('../../lib/CMError');
const { useMainPlayer, useQueue } = require('discord-player');
const CMPlayerWindow = require('../../lib/CMPlayerWindow');

class CommandPlay extends SlashCommand {
    constructor (creator) {
        super(creator, {
            name: 'play',
            description: 'Plays a song by URL, an attachment, or from a search result.',
            options: [
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'track',
                    description: 'Plays a song by a search term or URL.',
                    options: [{
                        type: CommandOptionType.STRING,
                        name: 'query',
                        description: 'The track to play.',
                        required: true,
                        autocomplete: true
                    }]
                },
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'attachment',
                    description: 'Plays a song from an attachment.',
                    options: [{
                        type: CommandOptionType.ATTACHMENT,
                        name: 'file',
                        description: 'The file to play. Supports both audio and video files.',
                        required: true
                    }]
                },
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'now',
                    description: 'Force play a song regardless if anything is playing or not.',
                    options: [{
                        type: CommandOptionType.STRING,
                        name: 'query',
                        description: 'The track to play.',
                        required: true,
                        autocomplete: true
                    }]
                },
                {
                    type: CommandOptionType.SUB_COMMAND_GROUP,
                    name: 'radio',
                    description: 'Plays a live radio station.',
                    options: [
                        {
                            type: CommandOptionType.SUB_COMMAND,
                            name: 'iheartradio',
                            description: 'Plays a radio station from iHeartRadio.',
                            options: [{
                                type: CommandOptionType.STRING,
                                name: 'station',
                                description: 'The station to play. The name of the station should match what you wanna play.',
                                required: true
                            }]
                        }
                    ]
                },
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'silently',
                    description: 'Plays a track silently. It will not be sent in chat, and will be hidden from others in the queue.',
                    options: [{
                        type: CommandOptionType.STRING,
                        name: 'query',
                        description: 'The track to silently play.',
                        required: true,
                        autocomplete: true
                    }]
                },
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'playlist',
                    description: 'Plays a custom playlist.',
                    options: [
                        {
                            type: CommandOptionType.STRING,
                            name: 'name',
                            description: 'The name of the playlist.',
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
        if (ctx.subcommands[0] === 'playlist') {
            try {
                const playlists = await this.client.playlists.get(ctx.guildID);

                const playlistMap = [];
                for (const [k, v] of Object.entries(playlists)) {
                    playlistMap.push({ name: k, value: v });
                }

                const filter = playlistMap.filter(x => x.name.startsWith(query));
                return ctx.sendResults(filter.map(x => ({ name: `${x.name} - ${x.value.tracks?.length} track${x.value.tracks?.length === 1 ? '' : 's'}`, value: `${x.name}` })));
            } catch (err) {
                if (err) {
                    this.client.logger.error(`Unable to gather autocomplete data.\n${err.stack}`);
                }
                return ctx.sendResults([]);
            }
        } else {
            if (hasURL(query)) return [];
            AutoComplete(query, (err, queries) => {
                if (err) {
                    this.client.logger.error(`Unable to gather autocomplete data.\n${err.stack}`);
                    return ctx.sendResults([]);
                }
                return ctx.sendResults(queries[1].map((x) => ({ name: x, value: x })));
            });
        }
    }

    async run (ctx) {
        if (ctx.channel.type === ChannelType.DM) {
            throw new CMError('NO_DMS_ALLOWED');
        }

        const settings = this.client.settings.get(ctx.guildID);

        const guild = this.client.guilds.cache.get(ctx.guildID);
        const channel = await guild.channels.fetch(ctx.channelID);
        const _member = await guild.members.fetch(ctx.user.id);

        const djMode = this.client.settings.get(ctx.guildID, 'djMode');
        const dj = await this.client.utils.isDJ(channel, _member);
        if (djMode) {
            if (!dj) return this.client.ui.sendPrompt(ctx, 'DJ_MODE');
        }

        const textChannel = this.client.settings.get(ctx.guildID, 'textChannel');
        if (textChannel) {
            if (textChannel !== channel.id) {
                return this.creator.ui.sendPrompt(ctx, 'WRONG_TEXT_CHANNEL_MUSIC', textChannel);
            }
        }

        const vc = _member.voice.channel;
        if (!vc) return this.client.ui.sendPrompt(ctx, 'NOT_IN_VC');

        if (!vc.permissionsFor(this.client.user.id).has(PermissionsBitField.Flags.Connect)) {
            return this.client.ui.sendPrompt(ctx, 'MISSING_CONNECT', vc.id);
        }

        if (vc.members.size === vc.userLimit) {
            if (vc.permissionsFor(this.client.user.id).has(PermissionsBitField.Flags.MoveMembers)) {} // eslint-disable-line no-empty, brace-style
            else {
                return this.client.ui.sendPrompt(ctx, 'FULL_CHANNEL');
            }
        }

        const player = useMainPlayer();
        const queue = useQueue(guild.id);

        if (ctx.subcommands[0] === 'track' || (ctx.subcommands[0] === 'now' && vc.members.size === 3)) {
            if (this.client.utils.pornPattern(ctx.options.track?.query)) {
                await ctx.defer(true);
                return this.client.ui.reply(ctx, 'no', "The URL you're requesting to play is not allowed.");
            }

            if (!dj) {
                if (hasURL(ctx.options.track?.query.replace(/(^\\<+|\\>+$)/g, ''))) {
                    const allowLinks = this.client.settings.get(ctx.guildID, 'allowLinks');
                    if (!allowLinks) {
                        return this.client.ui.reply(ctx, 'no', 'Cannot add your song to the queue because adding URL links is not allowed on this server.');
                    }
                }

                const list = await this.client.settings.get(guild.id, 'blockedPhrases');
                const splitSearch = ctx.options.track?.query.split(/ +/g);
                for (let i = 0; i < splitSearch.length; i++) {
                    /* eslint-disable-next-line no-useless-escape */
                    if (list.includes(splitSearch[i].replace(/(^\\<+|\\>+$)/g, ''))) {
                        await ctx.defer(true);
                        return this.client.ui.reply(ctx, 'no', 'Unable to queue your selection because your search contains a blocked phrase on this server.');
                    }
                }
            }
        }

        if (ctx.subcommands[0] === 'silently') {
            const allowSilent = this.client.settings.get(ctx.guildID, 'allowSilent');
            if (!dj && !allowSilent) {
                return this.client.ui.reply(ctx, 'no', 'You cannot add silent tracks to the queue in this server.');
            }
        }

        await ctx.defer(ctx.subcommands[0] === 'silently');

        try {
            this.client.utils.createAgent(this.client);

            let radioStation;
            let fileMetadata;
            let isFile = false;

            const boogie = async (requested) => {
                /*
                await this.client.player.play(vc, requested, {
                    textChannel: channel,
                    member: _member,
                    position: ctx.subcommands[0] === 'now' ? 1 : 0,
                    metadata: {
                        ctx,
                        isFile,
                        fileMetadata,
                        isRadio: ctx.subcommands[0] === 'radio',
                        radioStation: radioStation ?? undefined,
                        silent: ctx.subcommands[0] === 'silently'
                    }
                });
                */
                player.play(vc, requested, {
                    metadata: {
                        textChannel: channel
                    },
                    nodeOptions: {
                        volume: parseInt(settings.defaultVolume),
                        leaveOnStop: settings.leaveOnStop,
                        leaveOnEnd: settings.leaveOnFinish,
                        leaveOnEmpty: settings.leaveOnEmpty,
                        leaveOnEmptyCooldown: parseInt(settings.emptyCooldown)
                    }
                })
                    .then(song => {
                        if (vc.type === 'stage') {
                            const stageMod = vc.permissionsFor(this.client.user.id).has(PermissionsBitField.StageModerator);
                            if (!stageMod) {
                                try {
                                    guild.members.me.voice.setRequestToSpeak(true);
                                } catch {
                                    guild.members.me.voice.setSuppressed(false);
                                }
                            } else {
                                guild.members.me.voice.setSuppressed(false);
                            }
                        }

                        Object.assign(song.track, {
                            ctx,
                            member: _member,
                            file: isFile,
                            radioStation,
                            fileMetadata,
                            silent: ctx.subcommands[0] === 'silently',
                            isRadio: ctx.subcommands[0] === 'radio'
                        });

                        const window = new CMPlayerWindow()
                            .color(guild.members.me.displayColor !== 0 ? guild.members.me.displayColor : null)
                            .windowTitle(`Added to queue - ${_member.voice.channel.name}`, guild.iconURL({ dynamic: true }))
                            .trackTitle(`[${song.track.title}](${song.track.url})`)
                            .trackImage('small', song.track.thumbnail)
                            .setFooter(`${_member.user.globalName} - ${_member.user.tag.replace(/#0{1,1}$/, '')}`, _member.user.avatarURL({ dynamic: true }));

                        if (song.metadata?.silent) {
                            window.windowTitle(`Added silently to the queue - ${_member.voice.channel.name}`, guild.iconURL({ dynamic: true }));
                        }

                        if (queue && queue.tracks?.toArray().length > 0) {
                            window.addFields([{
                                name: ':bookmark_tabs: Position',
                                value: `${queue.tracks.toArray().indexOf(song)}` // Assuming the queue was just made.
                            }]);
                        }

                        if (ctx.subcommands[0] === 'now' && queue) {
                            try {
                                if (queue.isPlaying()) {
                                    if (vc.members.size <= 3 || dj) {
                                        queue.node.skip();
                                    } else {
                                        return this.client.ui.sendPrompt(ctx, 'NOT_ALONE');
                                    }
                                }
                            } catch {}
                        }

                        return ctx.send({ embeds: [window._embed] });
                    });
            };

            switch (ctx.subcommands[0]) {
            case 'track': {
                await boogie(ctx.options.track?.query.replace(/(^\\<+|\\>+$)/g, ''));
                break;
            }

            case 'now': {
                await boogie(ctx.options.now?.query.replace(/(^\\<+|\\>+$)/g, ''));
                break;
            }

            case 'attachment': {
                const file = ctx.attachments.first().url;

                // Check if ffprobe can find any any additional metadata to add.
                ffprobe(file, { path: ffprobeStatic.path })
                    .then(info => {
                        // Ffmpeg parses images as videos with just one single frame. So, to check
                        // whether the file is a video or an audio file, the best way would be to
                        // check whether the file has a duration. Texts files do have a duration. It's
                        // probably used to measure how many lines the file has, so it's codec name
                        // will be checked instead.
                        if (!info.streams[0].duration || info.streams[0].codec_name === 'ansi') {
                            return this.client.ui.reply(ctx, 'error', 'The attachment must be an audio or a video file.');
                        }

                        const time = Math.floor(info.streams[0].duration);

                        isFile = true;
                        fileMetadata = {
                            duration: time,
                            formattedDuration: toColonNotation(time + '000'),
                            codec: `${info.streams[0].codec_long_name} (\`${info.streams[0].codec_name}\`)`
                        };
                    })
                    .catch(() => {
                        return this.client.ui.reply(ctx, 'error', 'Invalid data was provided while processing the file, or the file is not supported.');
                    });

                await boogie(file);
                break;
            }

            case 'radio': {
                switch (ctx.subcommands[1]) {
                case 'iheartradio': {
                    if (!dj) {
                        const maxTime = await this.client.settings.get(guild.id, 'maxTime');

                        if (maxTime) {
                            return this.client.ui.reply(ctx, 'no', 'You can\'t add radio broadcasts to the queue while a max time limit is set on this server.');
                        }
                    }

                    const search = await iheart.search(ctx.options.radio.iheartradio.station);
                    const stations = search.stations;

                    const emojiNumber = {
                        1: '1️⃣',
                        2: '2️⃣',
                        3: '3️⃣',
                        4: '4️⃣',
                        5: '5️⃣',
                        6: '6️⃣',
                        7: '7️⃣',
                        8: '8️⃣',
                        9: '9️⃣',
                        10: '🔟'
                    };

                    const resultsFormattedList = stations.map(x => `**${emojiNumber[stations.indexOf(x) + 1]}** **${x.name}**\n${x.frequency} ${x.band} ${x.callLetters} - ${x.city} ${x.state}`).join('\n\n');

                    const embed = new EmbedBuilder()
                        .setColor(guild.members.me.displayColor !== 0 ? guild.members.me.displayColor : null)
                        .setAuthor({
                            name: 'Which station do you wanna tune to?',
                            iconURL: _member.user.avatarURL({ dynamic: true })
                        })
                        .setDescription(`${resultsFormattedList}`)
                        .setFooter({
                            text: 'Make your selection using the menu below.'
                        });

                    const menuOptions = [];
                    let i;
                    for (i = 0; i < stations.length; i++) {
                        const track = new StringSelectMenuOptionBuilder()
                            .setLabel(`${stations[i].name.length > 95
                                ? stations[i].name.substring(0, 92) + '...'
                                : stations[i].name}
                            `)
                            .setDescription(`${stations[i].frequency} ${stations[i].band} ${stations[i].callLetters} - ${stations[i].city} ${stations[i].state}`)
                            .setValue(`${i}`)
                            .setEmoji({
                                name: emojiNumber[i + 1]
                            });

                        menuOptions.push(track);
                    }

                    const menu = new StringSelectMenuBuilder()
                        .setCustomId('track_menu')
                        .setPlaceholder('Pick a station!')
                        .addOptions(menuOptions);

                    const cancel = new ButtonBuilder()
                        .setCustomId('cancel_search')
                        .setStyle(ButtonStyle.Danger)
                        .setEmoji(process.env.CLOSE);

                    const trackMenu = new ActionRowBuilder()
                        .addComponents(menu);

                    const cancelButton = new ActionRowBuilder()
                        .addComponents(cancel);

                    await ctx.send({ embeds: [embed], components: [trackMenu, cancelButton] });

                    ctx.registerComponent(
                        'track_menu',
                        async (selCtx) => {
                            if (ctx.user.id !== selCtx.user.id) {
                                await selCtx.defer(true);
                                return this.client.ui.reply(selCtx, 'no', 'That component can only be used by the user that ran this command.');
                            }

                            try {
                                channel.sendTyping();
                                const selected = await iheart.streamURL(stations[parseInt(selCtx.values[0])].id);
                                radioStation = stations[parseInt(selCtx.values[0])];
                                selCtx.acknowledge();
                                await boogie(selected);
                            } catch (err) {
                                return this.client.ui.reply(selCtx, 'error', err.message, 'Player Error');
                            } finally {
                                ctx.delete();
                            }
                        },
                        30 * 1000
                    );

                    ctx.registerComponent(
                        'cancel_search',
                        async (btnCtx) => {
                            if (ctx.user.id !== btnCtx.user.id) {
                                await btnCtx.defer(true);
                                return this.client.ui.reply(btnCtx, 'no', 'That component can only be used by the user that ran this command.');
                            }

                            btnCtx.acknowledge();
                            btnCtx.delete();
                        },
                        30 * 1000
                    );
                }
                }
                break;
            }

            case 'playlist': {
                if (vc.members.size <= 3 || dj) {
                    const playlists = await this.client.playlists.get(ctx.guildID, ctx.options.playlist.name);
                    const songs = playlists.tracks.map(x => x.url);

                    const playlist = await this.client.player.createCustomPlaylist(songs, {
                        member: _member,
                        properties: { name: ctx.options.playlist.name }
                    });

                    await boogie(playlist);
                } else {
                    return this.client.ui.sendPrompt(ctx, 'NOT_ALONE');
                }
                break;
            }

            case 'silently': {
                await boogie(ctx.options.silently?.query.replace(/(^\\<+|\\>+$)/g, ''));
                break;
            }
            }
        } catch (err) {
            this.client.logger.error(`Cannot play requested track.\n${err.stack}`); // Just in case.
            return this.client.ui.reply(ctx, 'error', err.message, 'Player Error');
        }
    }
}

module.exports = CommandPlay;
