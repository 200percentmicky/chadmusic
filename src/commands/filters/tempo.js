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

const { Command } = require('discord-akairo');
const { isSameVoiceChannel } = require('../../modules/isSameVoiceChannel');
const { pushFormatFilter } = require('../../modules/pushFormatFilter');

module.exports = class CommandTempo extends Command {
    constructor () {
        super('tempo', {
            aliases: ['tempo'],
            category: '📢 Filter',
            description: {
                text: 'Changes the tempo of the playing track.',
                usage: '<rate:int[0.1-10]>',
                details: '`<rate:int[0.1-10]>` The rate to change. Between 0.1-10'
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
        const dj = message.member.roles.cache.has(djRole) || message.channel.permissionsFor(message.member.user.id).has(['MANAGE_CHANNELS']);

        if (djMode) {
            if (!dj) return this.client.ui.send(message, 'DJ_MODE');
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
            if (!args[1]) {
                return this.client.ui.usage(message, 'tempo <rate:int[0.1-10]/off>');
            }

            if (args[1] === 'OFF'.toLowerCase()) {
                try {
                    await this.client.player.setFilter(message.guild.id, 'tempo', false);
                    pushFormatFilter(queue, 'Tempo', 'Off');
                    return this.client.ui.custom(message, '📢', process.env.COLOR_INFO, '**Tempo** Reverted');
                } catch (err) {
                    return this.client.ui.send(message, 'FILTER_NOT_APPLIED', 'Tempo');
                }
            }

            const rate = parseFloat(args[1]);
            if (isNaN(rate)) {
                return this.client.ui.reply(message, 'error', 'Tempo requires a number or **off**.');
            }
            if (rate < 0.1 || rate > 11) {
                return this.client.ui.reply(message, 'error', 'Tempo must be between **0.1-10** or **off**.');
            }
            await this.client.player.setFilter(message, 'tempo', `rubberband=tempo=${rate}`);
            pushFormatFilter(queue, 'Tempo', `Rate: \`${rate}\``);
            return this.client.ui.custom(message, '📢', process.env.COLOR_INFO, `**Tempo** Rate: \`${rate}\``);
        } else {
            if (!isSameVoiceChannel(this.client, message.member, vc)) return this.client.ui.send(message, 'ALREADY_SUMMONED_ELSEWHERE');
        }
    }
};
