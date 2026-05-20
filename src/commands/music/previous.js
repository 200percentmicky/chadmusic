/// ChadMusic
/// Copyright (C) 2026  Micky | 200percentmicky
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

module.exports = class CommandPrevious extends Command {
    constructor () {
        super('previous', {
            aliases: ['previous', 'back'],
            category: '🎶 Music',
            description: {
                text: 'Plays the previously played track.'
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

        const queue = this.client.player.getQueue(message.guild);

        const currentVc = this.client.vc.get(vc);
        if (!queue || !currentVc) return this.client.ui.sendPrompt(message, 'NOT_PLAYING');
        else if (!isSameVoiceChannel(this.client, message.member, vc)) return this.client.ui.sendPrompt(message, 'ALREADY_SUMMONED_ELSEWHERE');

        if (!this.client.player.options.savePreviousSongs) {
            return this.client.ui.reply(message, 'no', 'This feature is currently disabled.');
        }

        if (dj || this.client.utils.isSingleUser(message.member)) {
            if (queue.previousSongs.length === 0) {
                return this.client.ui.reply(message, 'warn', "There's no previous track to play.");
            }

            try {
                await queue.previous();
            } catch (err) {
                return this.client.ui.reply(message, 'error', `Unable to play the previous track. ${err}`);
            }
        } else {
            return this.client.ui.sendPrompt(message, 'NOT_ALONE');
        }
    }
};
