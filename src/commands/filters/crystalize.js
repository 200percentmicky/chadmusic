/// ChadMusic - The Chad Music Bot
/// Copyright (C) 2024  Micky | 200percentmicky
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
const { pushFormatFilter } = require('../../modules/pushFormatFilter');
const { isSameVoiceChannel } = require('../../modules/isSameVoiceChannel');

module.exports = class CommandCrystalize extends Command {
    constructor () {
        super('crystalize', {
            aliases: ['crystalize', 'crystal'],
            category: '📢 Filter',
            description: {
                text: 'Sharpens or softens the audio quality.',
                usage: '<intensity:-10~10/off>',
                details: '`<intensity:-10~10/off>` The intensity of the effect. Must be between -10 to 10 or off.'
            },
            channel: 'guild',
            clientPermissions: PermissionsBitField.Flags.EmbedLinks,
            args: [
                {
                    id: 'intensity',
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
            if (!args.intensity) return this.client.ui.usage(message, 'crystalize <intensity:-10~10/off>');

            if (args.intensity === 'OFF'.toLowerCase()) {
                try {
                    await queue.filters.set('crystalize', null);
                    pushFormatFilter(queue, 'Crystalize', 'Off');
                    return this.client.ui.custom(message, ':loudspeaker:', process.env.COLOR_INFO, '**Crystalize** Off');
                } catch (err) {
                    return this.client.ui.sendPrompt(message, 'FILTER_NOT_APPLIED', 'Crystalize');
                }
            } else {
                const intensity = parseFloat(args.intensity);

                if (intensity < -10 || intensity > 10 || isNaN(intensity)) {
                    return this.client.ui.reply(message, 'error', 'Intensity must be between **-10** to **10**, or **"off"**.');
                }

                await queue.filters.set('crystalize', `crystalizer=i=${intensity}`);
                pushFormatFilter(queue, 'Crystalize', `Intensity \`${intensity}\``);
                return this.client.ui.custom(message, ':loudspeaker:', process.env.COLOR_INFO, `**Crystalize** Intensity \`${intensity}\``);
            }
        } else {
            if (!isSameVoiceChannel(this.client, message.member, vc)) {
                return this.client.ui.sendPrompt(message, 'ALREADY_SUMMONED_ELSEWHERE');
            }
        }
    }
};
