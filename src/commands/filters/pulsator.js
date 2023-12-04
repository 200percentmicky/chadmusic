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

const { Command } = require('discord-akairo');
const { PermissionsBitField } = require('discord.js');
const { isSameVoiceChannel } = require('../../modules/isSameVoiceChannel');
const { pushFormatFilter } = require('../../modules/pushFormatFilter');

module.exports = class CommandPulsator extends Command {
    constructor () {
        super('pulsator', {
            aliases: ['pulsator'],
            category: '📢 Filter',
            description: {
                text: 'Adds a pulsating effect to the audio.',
                usage: '<frequency:0.01-100/off>',
                details: '`<frequency:0.01-100/off> The frequency of the effect in Hz. Must be between 0.01-100 or off.'
            },
            channel: 'guild',
            clientPermissions: PermissionsBitField.Flags.EmbedLinks,
            args: [
                {
                    id: 'frequency',
                    match: 'text'
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
            if (!args.frequency) return this.client.ui.usage(message, 'pulsator <frequency:0.01-100/off>');

            if (args.frequency === 'OFF'.toLowerCase()) {
                try {
                    await queue.filters.set('pulsator', null);
                    pushFormatFilter(queue, 'Pulsator', 'Off');
                    return this.client.ui.custom(message, ':loudspeaker:', process.env.COLOR_INFO, '**Pulsator** Off');
                } catch (err) {
                    return this.client.ui.sendPrompt(message, 'FILTER_NOT_APPLIED', 'Pulsator');
                }
            } else {
                const frequency = parseFloat(args.frequency);

                if (frequency < 0.01 || frequency > 100 || isNaN(frequency)) {
                    return this.client.ui.reply(message, 'error', 'Frequency must be between **0.01** to **100** or **"off"**.');
                }

                await queue.filters.set('pulsator', `apulsator=hz=${frequency}`);
                pushFormatFilter(queue, 'Pulsator', `Frequency: \`${frequency}Hz.\``);
                return this.client.ui.custom(message, ':loudspeaker:', process.env.COLOR_INFO, `**Pulsator** \`${frequency}Hz.\``);
            }
        } else {
            if (!isSameVoiceChannel(this.client, message.member, vc)) {
                return this.client.ui.sendPrompt(message, 'ALREADY_SUMMONED_ELSEWHERE');
            }
        }
    }
};
