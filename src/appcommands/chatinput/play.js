/**
 *  ChadMusic - The Chad Music Bot
 *  Copyright (C) 2022  Micky D. | @200percentmicky | Micky-kun#3836
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
const { PermissionsBitField } = require('discord.js');
const iheart = require('iheart');
const { hasURL } = require('../../modules/hasURL');
const { isSameVoiceChannel } = require('../../modules/isSameVoiceChannel');

const pornPattern = (url) => {
    // ! TODO: Come up with a better regex lol
    // eslint-disable-next-line no-useless-escape
    const pornPattern = /https?:\/\/(www\.)?(pornhub|xhamster|xvideos|porntube|xtube|youporn|pornerbros|pornhd|pornotube|pornovoisines|pornoxo)\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/g;
    const pornRegex = new RegExp(pornPattern);
    return url.match(pornRegex);
};

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
                        required: true
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
                        required: true
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
                }
            ]
        });

        this.filePath = __filename;
    }

    async run (ctx) {
        const guild = this.client.guilds.cache.get(ctx.guildID);
        const channel = await guild.channels.fetch(ctx.channelID);
        const _member = await guild.members.fetch(ctx.member.id);

        const djMode = this.client.settings.get(ctx.guildID, 'djMode');
        const djRole = this.client.settings.get(ctx.guildID, 'djRole');
        const dj = _member.roles.cache.has(djRole) || channel.permissionsFor(_member.user.id).has(PermissionsBitField.Flags.ManageChannels);
        if (djMode) {
            if (!dj) return this.client.ui.send(ctx, 'DJ_MODE');
        }

        const textChannel = this.client.settings.get(ctx.guildID, 'textChannel');
        if (textChannel) {
            if (textChannel !== channel.id) {
                return this.creator.ui.ctx(ctx, 'WRONG_TEXT_CHANNEL_MUSIC', textChannel);
            }
        }

        const vc = _member.voice.channel;
        if (!vc) return this.client.ui.send(ctx, 'NOT_IN_VC');

        // if (!text && !message.attachments.first()) return client.ui.usage(message, 'play <url/search/attachment>');

        if (ctx.subcommands[0] === 'track' || (ctx.subcommands[0] === 'now' && vc.members.size === 3)) {
            if (pornPattern(ctx.options.track?.query)) {
                await ctx.defer(true);
                return this.client.ui.ctx(ctx, 'no', "The URL you're requesting to play is not allowed.");
            }

            if (!dj) {
                if (hasURL(ctx.options.track?.query.replace(/(^\\<+|\\>+$)/g, ''))) {
                    const allowLinks = this.client.settings.get(ctx.guildID, 'allowLinks');
                    if (!allowLinks) {
                        return this.client.ui.ctx(ctx, 'no', 'Cannot add your song to the queue because adding URL links is not allowed on this server.');
                    }
                }

                const list = await this.client.settings.get(guild.id, 'blockedPhrases');
                const splitSearch = ctx.options.track?.query.split(/ +/g);
                for (let i = 0; i < splitSearch.length; i++) {
                    /* eslint-disable-next-line no-useless-escape */
                    if (list.includes(splitSearch[i].replace(/(^\\<+|\\>+$)/g, ''))) {
                        await ctx.defer(true);
                        return this.client.ui.ctx(ctx, 'no', 'Unable to queue your selection because your search contains a blocked phrase on this server.');
                    }
                }
            }
        }

        await ctx.defer();

        const currentVc = this.client.vc.get(vc);
        if (!currentVc) {
            const permissions = vc.permissionsFor(this.client.user.id).has(PermissionsBitField.Flags.Connect);
            if (!permissions) return this.client.ui.send(ctx, 'MISSING_CONNECT', vc.id);

            if (vc.type === 'stage') {
                try {
                    this.client.vc.join(vc);
                } catch (err) {
                    if (err.name.includes('[VOICE_FULL]')) return this.client.ui.send(ctx, 'FULL_CHANNEL');
                    else return this.client.ui.ctx(ctx, 'error', `Unable to join the voice channel. ${err.message}`);
                }
                const stageMod = vc.permissionsFor(this.client.user.id).has(PermissionsBitField.StageModerator);
                if (!stageMod) {
                    const requestToSpeak = vc.permissionsFor(this.client.user.id).has(PermissionsBitField.Flags.RequestToSpeak);
                    if (!requestToSpeak) {
                        this.client.vc.leave(guild);
                        return this.client.ui.send(ctx, 'MISSING_SPEAK', vc.id);
                    } else if (guild.members.me.voice.suppress) {
                        await guild.members.me.voice.setRequestToSpeak(true);
                    }
                } else {
                    await guild.members.me.voice.setSuppressed(false);
                }
            } else {
                try {
                    this.client.vc.join(vc);
                } catch (err) {
                    if (err.name.includes('[VOICE_FULL]')) return this.client.ui.send(ctx, 'FULL_CHANNEL');
                    else return this.client.ui.ctx(ctx, 'error', `Unable to join the voice channel. ${err.message}`);
                }
            }
        } else {
            if (!isSameVoiceChannel(this.client, _member, vc)) return this.client.ui.send(ctx, 'ALREADY_SUMMONED_ELSEWHERE');
        }

        const queue = this.client.player.getQueue(guild.id);

        // These limitations should not affect a member with DJ permissions.
        if (!dj) {
            if (queue) {
                const maxQueueLimit = await this.client.settings.get(guild.id, 'maxQueueLimit');
                if (maxQueueLimit) {
                    const queueMemberSize = queue.songs.filter(entries => entries.user.id === _member.user.id).length;
                    if (queueMemberSize >= maxQueueLimit) {
                        return this.client.ui.ctx(ctx, 'no', `You are only allowed to add a max of ${maxQueueLimit} entr${maxQueueLimit === 1 ? 'y' : 'ies'} to the queue.`);
                    }
                }
            }
        }

        try {
            let requested = ctx.options.track?.query;
            if (ctx.subcommands[0] === 'attachment') requested = ctx.attachments.first().url;
            if (ctx.subcommands[0] === 'radio') {
                switch (ctx.subcommands[1]) {
                case 'iheartradio': {
                    const search = await iheart.search(ctx.options.radio.iheartradio.station);
                    const station = search.stations[0];

                    // To prevent overwrites, lock the command until the value is cleared.
                    if (await this.client.radio.get(guild.id)) {
                        await ctx.defer(true);
                        return this.client.ui.ctx(ctx, 'warn', 'Request is still being processed. Please try again later.');
                    }

                    requested = await iheart.streamURL(station.id);

                    await this.client.radio.set(guild.id, ctx.options.radio.iheartradio.station, 10000);
                }
                }
            }

            if (ctx.subcommands[0] === 'now') {
                if (vc.members.size <= 3 || dj) {
                    requested = ctx.options.now.query;

                    await this.client.ui.ctxCustom(ctx, process.env.EMOJI_MUSIC, process.env.COLOR_MUSIC, `Searching \`${requested}\``);
                    channel.sendTyping();

                    /* eslint-disable-next-line no-useless-escape */
                    await this.client.player.play(vc, requested.replace(/(^\\<+|\\>+$)/g, ''), {
                        textChannel: channel,
                        member: _member,
                        position: 1
                    });
                    try {
                        await this.client.player.skip(guild);
                    } catch {}
                } else {
                    return this.client.ui.send(ctx, 'NOT_ALONE');
                }
            } else {
                await this.client.ui.ctxCustom(ctx, process.env.EMOJI_MUSIC, process.env.COLOR_MUSIC, `Searching \`${requested}\``);
                channel.sendTyping();

                /* eslint-disable-next-line no-useless-escape */
                await this.client.player.play(vc, requested.replace(/(^\\<+|\\>+$)/g, ''), {
                    textChannel: channel,
                    member: _member
                });
            }
            return;
        } catch (err) {
            this.client.logger.error(err.stack); // Just in case.
            return this.client.ui.ctx(ctx, 'error', `An unknown error occured:\n\`\`\`js\n${err.name}: ${err.message}\`\`\``, 'Player Error');
        }
    }
}

module.exports = CommandPlay;
