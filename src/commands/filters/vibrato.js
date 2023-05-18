/// ChadMusic - The Chad Music Bot
/// Copyright (C) 2023  Micky D. | @200percentmicky | Micky-kun#3836
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
const { PermissionsBitField } = require('discord.js');
const { isSameVoiceChannel } = require('../../modules/isSameVoiceChannel');
const { pushFormatFilter } = require('../../modules/pushFormatFilter');

module.exports = class CommandVibrato extends Command {
    constructor () {
        super('vibrato', {
            aliases: ['vibrato'],
            category: '📢 Filter',
            description: {
                text: 'Adds a vibrato filter to the player.',
                usage: '<depth:0.1-1/off> [frequency:int]',
                details: stripIndents`
                \`<depth:0.1-1/off>\` The depth of the vibrato. Must be between 0.1 to 1 or off.
                \`<frequency>\` The frequency of the vibrato.
                `
            },
            channel: 'guild',
            clientPermissions: PermissionsBitField.Flags.EmbedLinks,
            args: [
                {
                    id: 'depth',
                    match: 'phrase'
                },
                {
                    id: 'frequency',
                    match: 'phrase',
                    default: 5
                }
            ]
        });
    }

    async exec (message, args) {
        const djMode = this.client.settings.get(message.guild.id, 'djMode');
        const djRole = this.client.settings.get(message.guild.id, 'djRole');
        const allowFilters = this.client.settings.get(message.guild.id, 'allowFilters');
        const dj = message.member.roles.cache.has(djRole) ||
            message.channel.permissionsFor(message.member.user.id).has(PermissionsBitField.Flags.ManageChannels);

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
            if (args.depth === 'OFF'.toLowerCase()) {
                try {
                    await queue.filters.set('vibrato', null);
                    pushFormatFilter(queue, 'Vibrato', 'Off');
                    return this.client.ui.custom(message, '📢', process.env.COLOR_INFO, '**Vibrato** Off');
                } catch (err) {
                    return this.client.ui.sendPrompt(message, 'FILTER_NOT_APPLIED', 'Vibrato');
                }
            } else {
                if (!args.depth) {
                    return this.client.ui.usage(message, 'vibrato <depth:0.1-1/off> [frequency]');
                }
                const d = parseFloat(args.depth);
                const f = parseFloat(args.frequency);
                if (d < 0.1 || d > 1 || isNaN(d)) {
                    return this.client.ui.reply(message, 'error', 'Depth must be between **0.1** to **1**, or **off**.');
                }
                if (isNaN(f)) {
                    return this.client.ui.reply(message, 'error', 'Frequency requires a number.');
                }
                if (f < 0) {
                    return this.client.ui.reply(message, 'error', 'Frequency must be greater than 0.');
                }
                await queue.filters.set('vibrato', `vibrato=f=${f}:d=${d}`);
                pushFormatFilter(queue, 'Vibrato', `Depth \`${d}\` at \`${f}Hz\``);
                return this.client.ui.custom(message, '📢', process.env.COLOR_INFO, `**Vibrato** Depth \`${d}\` at \`${f}Hz\``);
            }
        } else {
            if (!isSameVoiceChannel(this.client, message.member, vc)) {
                return this.client.ui.sendPrompt(message, 'ALREADY_SUMMONED_ELSEWHERE');
            }
        }
    }
};
