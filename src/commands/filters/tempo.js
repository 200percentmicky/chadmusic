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
const { pushFormatFilter } = require('../../lib/pushFormatFilter');

module.exports = class CommandTempo extends Command {
    constructor () {
        super('tempo', {
            aliases: ['tempo'],
            category: '📢 Filter',
            description: {
                text: 'Changes the tempo of the playing track.',
                usage: '<rate:0.1-10>',
                details: '`<rate:0.1-10>` The rate to change. Must be between 0.1 to 10 or off.'
            },
            channel: 'guild',
            args: [
                {
                    id: 'rate',
                    match: 'text'
                }
            ]
        });
    }

    async exec (message, args) {
        const djMode = this.client.settings.get(message.guild.id, 'djMode');
        const allowFilters = this.client.settings.get(message.guild.id, 'allowFilters');
        const dj = await this.client.utils.isDJ(message.channel, message.member);

        if (djMode) {
            if (!dj) return this.client.ui.sendPrompt(message, 'DJ_MODE');
        }

        if (allowFilters === 'dj') {
            if (!dj) {
                return this.client.ui.sendPrompt(message, 'FILTERS_NOT_ALLOWED');
            }
        }

        const vc = message.member.voice.channel;
        if (!vc) return this.client.ui.sendPrompt(message, 'NOT_IN_VC');

        const queue = this.client.player.getQueue(message.guild.id);
        if (!queue) return this.client.ui.sendPrompt(message, 'NOT_PLAYING');

        if (queue.songs[0].isLive) {
            return this.client.ui.reply(message, 'no', 'This command is not available during live broadcasts.');
        }

        const currentVc = this.client.vc.get(vc);
        if (currentVc) {
            if (!args.rate) {
                return this.client.ui.usage(message, 'tempo <rate:int[0.1-10]/off>');
            }

            if (args.rate === 'OFF'.toLowerCase()) {
                try {
                    await queue.filters.set('tempo', null);
                    pushFormatFilter(queue, 'Tempo', 'Off');
                    return this.client.ui.custom(message, ':loudspeaker:', process.env.COLOR_INFO, '**Tempo** Reverted');
                } catch (err) {
                    return this.client.ui.sendPrompt(message, 'FILTER_NOT_APPLIED', 'Tempo');
                }
            }

            const rate = parseFloat(args.rate);
            if (isNaN(rate)) {
                return this.client.ui.reply(message, 'error', 'Tempo requires a number or **off**.');
            }
            if (rate < 0.1 || rate > 11) {
                return this.client.ui.reply(message, 'error', 'Tempo must be between **0.1-10** or **off**.');
            }
            await queue.filters.set('tempo', `rubberband=tempo=${rate}`);
            pushFormatFilter(queue, 'Tempo', `Rate: \`${rate}\``);
            return this.client.ui.custom(message, ':loudspeaker:', process.env.COLOR_INFO, `**Tempo** Rate: \`${rate}\``);
        } else {
            if (!isSameVoiceChannel(this.client, message.member, vc)) return this.client.ui.sendPrompt(message, 'ALREADY_SUMMONED_ELSEWHERE');
        }
    }
};
