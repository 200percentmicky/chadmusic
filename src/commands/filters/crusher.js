/// ChadMusic - The Chad Music Bot
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

const { stripIndents } = require('common-tags');
const { Command } = require('discord-akairo');
const { isSameVoiceChannel } = require('../../lib/isSameVoiceChannel');
const { pushFormatFilter } = require('../../lib/pushFormatFilter');

module.exports = class CommandCrusher extends Command {
    constructor () {
        super('crusher', {
            aliases: ['crusher'],
            category: '📢 Filter',
            description: {
                text: 'Crushes the audio without changing the bit depth. Makes it sound more harsh and "digital".',
                usage: '<sample:1-250/off> [bits:1-64] [mode:log/lin]',
                details: stripIndents`
                \`<sample:1-250/off>\` The sample reduction. Must be between 1-250 or off.
                \`[bits:1-64]\` The bit reduction. Must be between 1-64. Default is \`8\`.
                \`[mode:log/lin]\` Changes logarithmic mode to either linear (lin) or logarithmic (log). \`lin\` is default.
                `
            },
            channel: 'guild',
            args: [
                {
                    id: 'samples',
                    type: 'string',
                    match: 'phrase'
                },
                {
                    id: 'bits',
                    type: 'integer'
                },
                {
                    id: 'mode',
                    type: 'string',
                    match: 'phrase'
                }
            ]
        });
    }

    async exec (message, args) {
        const djMode = this.client.settings.get(message.guild.id, 'djMode');
        const allowFilters = this.client.settings.get(message.guild.id, 'allowFilters');
        const dj = await this.client.utils.isDJ(message.channel, message.member);

        if (djMode) {
            if (!dj) {
                return this.client.ui.sendPrompt(message, 'DJ_MODE');
            }
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

        const currentVc = this.client.vc.get(vc);
        if (currentVc) {
            if (args.samples === 'OFF'.toLowerCase()) {
                try {
                    await queue.filters.set('crusher', null);
                    pushFormatFilter(queue, 'Crusher', 'Off');
                    return this.client.ui.custom(message, ':loudspeaker:', process.env.COLOR_INFO, '**Crusher** Off');
                } catch (err) {
                    return this.client.ui.sendPrompt(message, 'FILTER_NOT_APPLIED', 'Crusher');
                }
            } else {
                if (!args.samples) {
                    return this.client.ui.usage(message, 'crusher <sample:1-250/off> [bits:1-64] [mode:log/lin]');
                }
                const samples = parseFloat(args.samples);
                let bits = parseFloat(args.bits);
                let mode = args.mode;

                if (samples < 1 || samples > 250 || isNaN(samples)) {
                    return this.client.ui.reply(message, 'error', 'Sample reduction must be between **1** to **250**, or **off**.');
                }

                if (!args.bits) bits = 8;
                if (bits < 1 || bits > 64 || isNaN(bits)) {
                    return this.client.ui.reply(message, 'error', 'Bit reduction must be between **1** to **64**.');
                }

                const supportedModes = ['lin', 'log'];
                if (!args.mode) mode = 'lin';
                if (!supportedModes.includes(mode)) {
                    return this.client.ui.reply(message, 'error', 'Supported logarithmic modes are **lin** for linear and **log** for logarithmic.');
                }

                await queue.filters.set('crusher', `acrusher=samples=${samples}:bits=${bits}:mode=${mode}`);
                pushFormatFilter(queue, 'Crusher', `Sample size \`${samples}\` at \`${bits}\` bits. Mode: ${mode}`);
                return this.client.ui.custom(message, ':loudspeaker:', process.env.COLOR_INFO, `**Crusher** Sample size \`${samples}\` at \`${bits}\` bits. Mode: ${mode}`);
            }
        } else {
            if (!isSameVoiceChannel(this.client, message.member, vc)) {
                return this.client.ui.sendPrompt(message, 'ALREADY_SUMMONED_ELSEWHERE');
            }
        }
    }
};
