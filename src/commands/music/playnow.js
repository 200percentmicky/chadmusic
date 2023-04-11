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

const { Command } = require('discord-akairo');
const { Message, PermissionsBitField } = require('discord.js');
const { isSameVoiceChannel } = require('../../modules/isSameVoiceChannel');
const { CommandContext } = require('slash-create');

function pornPattern (url) {
    // ! TODO: Come up with a better regex lol
    // eslint-disable-next-line no-useless-escape
    const pornPattern = /https?:\/\/(www\.)?(pornhub|xhamster|xvideos|porntube|xtube|youporn|pornerbros|pornhd|pornotube|pornovoisines|pornoxo)\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/g;
    const pornRegex = new RegExp(pornPattern);
    return url.match(pornRegex);
}

module.exports = class CommandPlayNow extends Command {
    constructor () {
        super('playnow', {
            aliases: ['playnow', 'pn'],
            category: '🎶 Music',
            description: {
                text: 'Plays a song regardless if there is anything currently playing.',
                usage: 'playnow <URL/search>'
            },
            channel: 'guild',
            clientPermissions: PermissionsBitField.Flags.EmbedLinks,
            args: [
                {
                    id: 'track',
                    match: 'rest'
                }
            ]
        });
    }

    async exec (message, args) {
        if (message instanceof CommandContext) await message.defer();

        const text = args.track;
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

        if (!text && !message.attachments.first()) return this.client.ui.usage(message, 'playnow <url/search/attachment>');

        if (pornPattern(text)) return this.client.ui.reply(message, 'no', "The URL you're requesting to play is not allowed.");

        const queue = this.client.player.getQueue(message);
        if (!queue) return this.client.ui.reply(message, 'warn', 'Nothing is currently playing in this server. Use the `play` command instead.');

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

        if (vc.members.size <= 3 || dj) {
            if (!isSameVoiceChannel(this.client, message.member, vc)) return this.client.ui.sendPrompt(message, 'ALREADY_SUMMONED_ELSEWHERE');

            if (message instanceof CommandContext) {} // eslint-disable-line no-empty, brace-style
            else message.channel.sendTyping();

            // eslint-disable-next-line no-useless-escape
            await this.client.player.play(vc, text.replace(/(^\<+|\>+$)/g, '') || message.attachments.first().url, {
                member: message.member,
                textChannel: message.channel,
                message: message instanceof Message ? message : undefined,
                skip: true,
                metadata: {
                    ctx: message instanceof CommandContext ? message : undefined
                }
            });
            await this.client.player.skip(message);
            message.react(process.env.REACTION_OK);
        } else {
            return this.client.ui.sendPrompt(message, 'NOT_ALONE');
        }
    }
};
