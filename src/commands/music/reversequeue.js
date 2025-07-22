/// ChadMusic
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

const { Command } = require('discord-akairo');
const { isSameVoiceChannel } = require('../../lib/isSameVoiceChannel');

module.exports = class CommandReverseQueue extends Command {
    constructor () {
        super('reversequeue', {
            aliases: ['reversequeue', 'rq'],
            category: '🎶 Music',
            description: {
                text: 'Reverses the order of the queue.'
            },
            channel: 'guild'
        });
    }

    async exec (message) {
        const djMode = this.client.settings.get(message.guild.id, 'djMode');
        const dj = await this.client.utils.isDJ(message.channel, message.member);
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

        const currentVc = this.client.vc.get(vc);
        if (!this.client.player.getQueue(message) || !currentVc) return this.client.ui.sendPrompt(message, 'NOT_PLAYING');
        else if (!isSameVoiceChannel(this.client, message.member, vc)) return this.client.ui.sendPrompt(message, 'ALREADY_SUMMONED_ELSEWHERE');

        if (vc.members.size <= 2 || dj) {
            const queue = this.client.player.getQueue(message);

            /* Slice the original queue */
            const queueLength = queue.songs.length;
            const newQueue = queue.songs.slice(1, queueLength);

            /* Remove the existing elements in the queue */
            queue.songs.splice(1, queueLength);

            /* Reverse the new queue */
            newQueue.reverse();

            /* Finally, push the new queue into the player's queue. */
            Array.prototype.push.apply(queue.songs, newQueue);

            return this.client.ui.reply(message, 'ok', 'The order of the queue has been reversed.');
        } else {
            return this.client.ui.sendPrompt(message, 'NOT_ALONE');
        }
    }
};
