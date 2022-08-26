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

module.exports = class CommandDisconnect extends Command {
    constructor () {
        super('disconnect', {
            aliases: ['disconnect', 'leave', 'pissoff', 'fuckoff'],
            category: '🎶 Music',
            description: {
                text: 'Disconnects from the current voice channel.'
            },
            channel: 'guild',
            clientPermissions: PermissionsBitField.Flags.EmbedLinks
        });
    }

    async exec (message) {
        const djMode = this.client.settings.get(message.guild.id, 'djMode');
        const djRole = this.client.settings.get(message.guild.id, 'djRole');
        const dj = message.member.roles.cache.has(djRole) || message.channel.permissionsFor(message.member.user.id).has(PermissionsBitField.Flags.ManageChannels);
        if (djMode) {
            if (!dj) {
                return this.client.ui.send(message, 'DJ_MODE');
            }
        }

        const textChannel = this.client.settings.get(message.guild.id, 'textChannel', null);
        if (textChannel) {
            if (textChannel !== message.channel.id) {
                return this.client.ui.send(message, 'WRONG_TEXT_CHANNEL_MUSIC', textChannel);
            }
        }

        const vc = message.member.voice.channel;
        const currentVc = this.client.vc.get(message.member.voice.channel);
        if (!currentVc) {
            return this.client.ui.reply(message, 'error', 'I\'m not in any voice channel.');
        }

        if (!vc) {
            return this.client.ui.send(message, 'NOT_IN_VC');
        } else if (!isSameVoiceChannel(this.client, message.member, vc)) {
            return this.client.ui.send(message, 'ALREADY_SUMMONED_ELSEWHERE');
        }

        if (vc.members.size <= 2 || dj) {
            if (this.client.player.getQueue(message)) {
                this.client.player.stop(message);
            }
            this.client.vc.leave(message);
            return this.client.ui.custom(message, '📤', 0xDD2E44, `Left <#${vc.id}>`);
        } else {
            return this.client.ui.send(message, 'NOT_ALONE');
        }
    }
};
