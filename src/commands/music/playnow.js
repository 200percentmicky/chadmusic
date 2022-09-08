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

const { Command } = require('discord-akairo');
const { PermissionsBitField } = require('discord.js');
const { isSameVoiceChannel } = require('../../modules/isSameVoiceChannel');

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
            clientPermissions: PermissionsBitField.Flags.EmbedLinks
        });
    }

    async exec (message) {
        const args = message.content.split(/ +/g);
        const text = args.slice(1).join(' ');
        const djMode = this.client.settings.get(message.guild.id, 'djMode');
        const djRole = this.client.settings.get(message.guild.id, 'djRole');
        const dj = message.member.roles.cache.has(djRole) || message.channel.permissionsFor(message.member.user.id).has(PermissionsBitField.Flags.ManageChannels);
        if (djMode) {
            if (!dj) return this.client.ui.send(message, 'DJ_MODE');
        }

        const textChannel = this.client.settings.get(message.guild.id, 'textChannel', null);
        if (textChannel) {
            if (textChannel !== message.channel.id) {
                return this.client.ui.send(message, 'WRONG_TEXT_CHANNEL_MUSIC', textChannel);
            }
        }

        const vc = message.member.voice.channel;
        if (!vc) return this.client.ui.send(message, 'NOT_IN_VC');

        if (!text && !message.attachments.first()) return this.client.ui.usage(message, 'playnow <url/search/attachment>');

        if (pornPattern(text)) return this.client.ui.reply(message, 'no', "The URL you're requesting to play is not allowed.");

        const queue = this.client.player.getQueue(message);
        if (!queue) return this.client.ui.reply(message, 'warn', 'Nothing is currently playing in this server. Use the `play` command instead.');

        const currentVc = this.client.vc.get(vc);
        if (!currentVc) {
            try {
                await this.client.vc.join(vc);
            } catch (err) {
                const permissions = vc.permissionsFor(this.client.user.id).has(PermissionsBitField.Flags.Connect);
                if (!permissions) return this.client.ui.send(message, 'MISSING_CONNECT', vc.id);
                else return this.client.ui.reply(message, 'error', `An error occured connecting to the voice channel. ${err.message}`);
            }

            if (vc.type === 'stage') {
                const stageMod = vc.permissionsFor(this.client.user.id).has(PermissionsBitField.StageModerator);
                if (!stageMod) {
                    const requestToSpeak = vc.permissionsFor(this.client.user.id).has(PermissionsBitField.Flags.RequestToSpeak);
                    if (!requestToSpeak) {
                        this.client.vc.leave(message.guild);
                        return this.client.ui.send(message, 'MISSING_SPEAK', vc.id);
                    } else if (message.guild.members.me.voice.suppress) {
                        await message.guild.members.me.voice.setRequestToSpeak(true);
                    }
                } else {
                    await message.guild.members.me.voice.setSuppressed(false);
                }
            }
        } else {
            if (!isSameVoiceChannel(this.client, message.member, vc)) return this.client.ui.send(message, 'ALREADY_SUMMONED_ELSEWHERE');
        }

        if (vc.members.size <= 3 || dj) {
            if (!isSameVoiceChannel(this.client, message.member, vc)) return this.client.ui.send(message, 'ALREADY_SUMMONED_ELSEWHERE');

            message.channel.sendTyping();
            // Adding song to position 1 of the queue. options.skip is shown to be unreliable.
            // This is probably due to the addition of metadata being passed into the player.
            // The bot does not use this for now, as its using events to parse info instead.
            // eslint-disable-next-line no-useless-escape
            await this.client.player.play(vc, text.replace(/(^\<+|\>+$)/g, '') || message.attachments.first().url, {
                member: message.member,
                textChannel: message.channel,
                message: message,
                skip: true
            });
            await this.client.player.skip(message);
            message.react(process.env.REACTION_OK);
        } else {
            return this.client.ui.send(message, 'NOT_ALONE');
        }
    }
};
