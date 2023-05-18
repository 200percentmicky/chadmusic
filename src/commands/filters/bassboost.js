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

module.exports = class CommandBassBoost extends Command {
    constructor () {
        super('bassboost', {
            aliases: ['bassboost', 'bass'],
            category: '📢 Filter',
            description: {
                text: 'Boosts the bass of the player.',
                usage: '<gain:1-100/off>',
                details: '`<gain:1-100/off> The gain of the bass boost. Must be between 1-100 or off.'
            },
            channel: 'guild',
            clientPermissions: PermissionsBitField.Flags.EmbedLinks,
            args: [
                {
                    id: 'gain',
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
            if (!args.gain) return this.client.ui.usage(message, 'bassboost <gain:1-100/off>');

            if (args.gain === 'OFF'.toLowerCase()) {
                try {
                    await queue.filters.set('bassboost', null);
                    pushFormatFilter(queue, 'Bass Boost', 'Off');
                    return this.client.ui.custom(message, ':loudspeaker:', process.env.COLOR_INFO, '**Bass Boost** Off');
                } catch (err) {
                    return this.client.ui.sendPrompt(message, 'FILTER_NOT_APPLIED', 'Bass Boost');
                }
            } else {
                const gain = parseFloat(args.gain);

                if (gain < 1 || gain > 100 || isNaN(gain)) {
                    return this.client.ui.reply(message, 'error', 'Bass gain must be between **1** to **100**, or **"off"**.');
                }

                await queue.filters.set('bassboost', `bass=g=${gain}`);
                pushFormatFilter(queue, 'Bass Boost', `Gain: \`${gain}dB\``);
                return this.client.ui.custom(message, ':loudspeaker:', process.env.COLOR_INFO, `**Bass Boost** Gain \`${gain}dB\``);
            }
        } else {
            if (!isSameVoiceChannel(this.client, message.member, vc)) {
                return this.client.ui.sendPrompt(message, 'ALREADY_SUMMONED_ELSEWHERE');
            }
        }
    }
};
