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

const { Command } = require('discord-akairo');
const { isSameVoiceChannel } = require('../../modules/isSameVoiceChannel');

module.exports = class CommandDisconnect extends Command {
    constructor () {
        super('disconnect', {
            aliases: ['disconnect', 'leave', 'pissoff', 'fuckoff'],
            category: '🎶 Music',
            description: {
                text: 'Disconnects from the current voice channel.'
            },
            channel: 'guild'
        });
    }

    async exec (message) {
        const djMode = this.client.settings.get(message.guild.id, 'djMode');
        const dj = await this.client.utils.isDJ(message.channel, message.member);
        if (djMode) {
            if (!dj) {
                return this.client.ui.sendPrompt(message, 'DJ_MODE');
            }
        }

        const textChannel = this.client.settings.get(message.guild.id, 'textChannel', null);
        if (textChannel) {
            if (textChannel !== message.channel.id) {
                return this.client.ui.sendPrompt(message, 'WRONG_TEXT_CHANNEL_MUSIC', textChannel);
            }
        }

        const vc = message.member.voice.channel;
        const currentVc = this.client.vc.get(message.member.voice.channel);
        if (!currentVc) {
            return this.client.ui.reply(message, 'error', 'I\'m not in any voice channel.');
        }

        if (!vc) {
            return this.client.ui.sendPrompt(message, 'NOT_IN_VC');
        } else if (!isSameVoiceChannel(this.client, message.member, vc)) {
            return this.client.ui.sendPrompt(message, 'ALREADY_SUMMONED_ELSEWHERE');
        }

        if (vc.members.size <= 2 || dj) {
            const queue = this.client.player.getQueue(message);
            if (queue) {
                this.client.player.stop(message);
            }
            this.client.vc.leave(message.guild);
            return this.client.ui.custom(message, ':outbox_tray:', 0xDD2E44, `Left <#${vc.id}>`);
        } else {
            return this.client.ui.sendPrompt(message, 'NOT_ALONE');
        }
    }
};
