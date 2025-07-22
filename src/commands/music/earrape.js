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

module.exports = class CommandEarrape extends Command {
    constructor () {
        super('earrape', {
            aliases: ['earrape'],
            category: '🎶 Music',
            description: {
                text: 'Changes the volume of the player to 69420%.',
                details: 'The ratio that no man can withstand. Only works if Unlimited Volume is On.'
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

        const allowFreeVolume = await this.client.settings.get(message.guild.id, 'allowFreeVolume', true);
        if (!allowFreeVolume) {
            return this.client.ui.sendPrompt(message, 'FEATURE_DISABLED', 'Free Volume');
        }

        // This command should not be limited by the DJ Role. Must be a toggable setting.
        const vc = message.member.voice.channel;
        if (!vc) {
            return this.client.ui.sendPrompt(message, 'NOT_IN_VC');
        } else if (!isSameVoiceChannel(this.client, message.member, vc)) {
            return this.client.ui.sendPrompt(message, 'ALREADY_SUMMONED_ELSEWHERE');
        }

        const queue = this.client.player.getQueue(message.guild.id);
        if (!queue) {
            return this.client.ui.sendPrompt(message, 'NOT_PLAYING');
        }

        const earrape = 69420; // 😂👌👌💯
        const volume = this.client.player.getQueue(message).volume;
        const defaultVolume = this.client.settings.get(message.guild.id, 'defaultVolume', 100);
        if (volume >= 5000) {
            this.client.player.setVolume(message, defaultVolume);
            return this.client.ui.reply(message, 'ok', `Volume has been set to **${defaultVolume}%**. 😌🙏`);
        } else {
            this.client.player.setVolume(message, earrape);
            return this.client.ui.reply(
                message,
                'warn',
                `🔊💢💀 Volume has been set to **${earrape}%**. 😂👌`,
                null,
                'Volumes exceeding 200% may cause damage to self and equipment.'
            );
        }
    }
};
