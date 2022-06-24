/**
 *  Micky-bot
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

const { stripIndents } = require('common-tags');
const { Command } = require('discord-akairo');
const { isSameVoiceChannel } = require('../../modules/isSameVoiceChannel');
const { pushFormatFilter } = require('../../modules/pushFormatFilter');

module.exports = class CommandVibrato extends Command {
    constructor () {
        super('vibrato', {
            aliases: ['vibrato'],
            category: '📢 Filter',
            description: {
                text: 'Adds a vibrato filter to the player.',
                usage: '<depth:int(0.1-1)/off> [frequency:int]',
                details: stripIndents`
        \`<depth:int(0.1-1)/off>\` The depth of the vibrato between 0.1-1, or "off" to disable it.
        \`<frequency:int>\` The frequency of the vibrato.
        `
            },
            channel: 'guild',
            clientPermissions: ['EMBED_LINKS']
        });
    }

    async exec (message) {
        const args = message.content.split(/ +/g);
        const djMode = this.client.settings.get(message.guild.id, 'djMode');
        const djRole = this.client.settings.get(message.guild.id, 'djRole');
        const allowFilters = this.client.settings.get(message.guild.id, 'allowFilters');
        const dj = message.member.roles.cache.has(djRole) ||
      message.channel.permissionsFor(message.member.user.id).has(['MANAGE_CHANNELS']);

        if (djMode) {
            if (!dj) {
                return this.client.ui.send(message, 'DJ_MODE');
            }
        }

        if (allowFilters === 'dj') {
            if (!dj) {
                return this.client.ui.send(message, 'FILTERS_NOT_ALLOWED');
            }
        }

        const vc = message.member.voice.channel;
        if (!vc) return this.client.ui.send(message, 'NOT_IN_VC');

        const queue = this.client.player.getQueue(message.guild.id);
        if (!queue) return this.client.ui.send(message, 'NOT_PLAYING');

        const currentVc = this.client.vc.get(vc);
        if (currentVc) {
            if (args[1] === 'OFF'.toLowerCase()) {
                try {
                    await this.client.player.setFilter(message.guild.id, 'vibrato', false);
                    pushFormatFilter(queue, 'Vibrato', 'Off');
                    return this.client.ui.custom(message, '📢', process.env.COLOR_INFO, '**Vibrato** Off');
                } catch (err) {
                    return this.client.ui.send(message, 'FILTER_NOT_APPLIED', 'Vibrato');
                }
            } else {
                if (!args[1]) {
                    return this.client.ui.usage(message, 'vibrato <depth:int(0.1-1)/off> [frequency:int]');
                }
                const d = parseFloat(args[1]);
                let f = parseFloat(args[2]);
                if (d < 0.1 || d > 1 || isNaN(d)) {
                    return this.client.ui.reply(message, 'error', 'Depth must be between **0.1** to **1**, or **off**.');
                }
                if (!args[2]) f = 5;
                if (isNaN(f)) {
                    return this.client.ui.reply(message, 'error', 'Frequency requires a number.');
                }
                if (f < 0) {
                    return this.client.ui.reply(message, 'error', 'Frequency must be greater than 0.');
                }
                await this.client.player.setFilter(message.guild.id, 'vibrato', `vibrato=f=${f}:d=${d}`);
                pushFormatFilter(queue, 'Vibrato', `Depth \`${d}\` at \`${f}Hz\``);
                return this.client.ui.custom(message, '📢', process.env.COLOR_INFO, `**Vibrato** Depth \`${d}\` at \`${f}Hz\``);
            }
        } else {
            if (!isSameVoiceChannel(this.client, message.member, vc)) {
                return this.client.ui.send(message, 'ALREADY_SUMMONED_ELSEWHERE');
            }
        }
    }
};
