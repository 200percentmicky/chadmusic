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

const { Command } = require('discord-akairo');
const { PermissionsBitField, Message } = require('discord.js');
const ytdl = require('@distube/ytdl-core');
const { getRandomIPv6 } = require('@distube/ytdl-core/lib/utils');
const { isSameVoiceChannel } = require('../../modules/isSameVoiceChannel');
const { hasURL } = require('../../modules/hasURL');
const { CommandContext } = require('slash-create');

/* eslint-disable no-useless-escape */

module.exports = class CommandPlay extends Command {
    constructor () {
        super('play', {
            aliases: ['play', 'p'],
            category: '🎶 Music',
            description: {
                text: 'Play\'s a song from a URL or search term.',
                usage: '<url/search/attachment>',
                details: '`<url/search>` The URL or search term to load. Also support audio and video attachments.'
            },
            channel: 'guild',
            clientPermissions: [PermissionsBitField.Flags.EmbedLinks],
            args: [
                {
                    id: 'track',
                    match: 'rest'
                }
            ]
        });
    }

    // Just to remove the error. A function with the same name is called elsewhere.
    async autocomplete () {}

    async exec (message, args) {
        if (message instanceof CommandContext) await message.defer();

        const djMode = this.client.settings.get(message.guild.id, 'djMode');
        const djRole = this.client.settings.get(message.guild.id, 'djRole');
        const dj = message.member.roles.cache.has(djRole) || message.channel.permissionsFor(message.member.user.id).has(PermissionsBitField.Flags.ManageChannels);
        if (djMode) {
            if (!dj) return this.client.ui.sendPrompt(message, 'DJ_MODE');
        }

        const textChannel = this.client.settings.get(message.guild.id, 'textChannel', null);
        if (textChannel) {
            if (textChannel !== message.channel.id) {
                return this.client.ui.sendPrompt(message, 'WRONG_TEXT_CHANNEL_MUSIC', textChannel);
            }
        }

        const vc = message.member.voice.channel;
        if (!vc) return this.client.ui.sendPrompt(message, 'NOT_IN_VC');

        if (!args.track && !message.attachments.first()) return this.client.ui.usage(message, 'play <url/search/attachment>');

        if (this.client.utils.pornPattern(args.track?.replace(/(^\<+|\>+$)/g, '') || message.attachments.first().url)) {
            return this.client.ui.reply(message, 'no', "The URL you're requesting to play is not allowed.");
        }

        if (args.track) {
            if (hasURL(args.track?.replace(/(^\<+|\>+$)/g, '')) && args.track) {
                const allowLinks = this.client.settings.get(message.guild.id, 'allowLinks');
                if (!dj && !allowLinks) {
                    return this.client.ui.reply(message, 'no', 'Cannot add your song to the queue because adding URL links is not allowed on this server.');
                }
            }

            const list = await this.client.settings.get(message.guild.id, 'blockedPhrases');
            const splitSearch = args.track.split(/ +/g);
            if (list.length > 0) {
                if (!dj) {
                    for (let i = 0; i < splitSearch.length; i++) {
                        /* eslint-disable-next-line no-useless-escape */
                        if (list.includes(splitSearch[i].replace(/(^\<+|\>+$)/g, ''))) {
                            return this.client.ui.reply(message, 'no', 'Unable to queue your selection because your search contains a blocked phrase on this server.');
                        }
                    }
                }
            }
        }

        const currentVc = this.client.vc.get(vc);
        if (!currentVc) {
            try {
                this.client.vc.join(vc);
            } catch (err) {
                const permissions = vc.permissionsFor(this.client.user.id).has(PermissionsBitField.Flags.Connect);
                if (!permissions) return this.client.ui.sendPrompt(message, 'MISSING_CONNECT', vc.id);
                else if (err.name.includes('[VOICE_FULL]')) return this.client.ui.sendPrompt(message, 'FULL_CHANNEL');
                else return this.client.ui.reply(message, 'error', `An error occured connecting to the voice channel. ${err.message}`);
            }

            if (vc.type === 'stage') {
                const stageMod = vc.permissionsFor(this.client.user.id).has(PermissionsBitField.StageModerator);
                if (!stageMod) {
                    try {
                        await message.guild.members.me.voice.setRequestToSpeak(true);
                    } catch {
                        await message.guild.members.me.voice.setSuppressed(false);
                    }
                } else {
                    await message.guild.members.me.voice.setSuppressed(false);
                }
            }
        } else {
            if (!isSameVoiceChannel(this.client, message.member, vc)) return this.client.ui.sendPrompt(message, 'ALREADY_SUMMONED_ELSEWHERE');
        }

        const queue = this.client.player.getQueue(message.guild.id);

        if (message instanceof CommandContext) {} // eslint-disable-line no-empty, brace-style
        else message.channel.sendTyping();

        // These limitations should not affect a member with DJ permissions.
        if (!dj) {
            if (queue) {
                const maxQueueLimit = await this.client.settings.get(message.guild.id, 'maxQueueLimit');
                if (maxQueueLimit) {
                    const queueMemberSize = queue.songs.filter(entries => entries.user.id === message.member.user.id).length;
                    if (queueMemberSize >= maxQueueLimit) {
                        return this.client.ui.reply(message, 'no', `You are only allowed to add a max of ${maxQueueLimit} entr${maxQueueLimit === 1 ? 'y' : 'ies'} to the queue.`);
                    }
                }
            }
        }

        try {
            this.client.player.options.ytdlOptions.agent = process.env.IPV6_BLOCK
                ? ytdl.createAgent(undefined, {
                    localAddress: getRandomIPv6(process.env.IPV6_BLOCK)
                })
                : undefined;

            await this.client.player.play(vc, args.track?.replace(/(^\<+|\>+$)/g, '') ?? message.attachments.first().url, {
                member: message.member,
                textChannel: message.channel,
                message: message instanceof Message ? message : undefined,
                metadata: {
                    message
                }
            });
            return message.react(process.env.REACTION_MUSIC);
        } catch (err) {
            this.client.logger.error(`Cannot play requested track.\n${err.stack}`); // Just in case.
            return this.client.ui.reply(message, 'error', err, 'Player Error');
        }
    }
};
