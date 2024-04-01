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

const { stripIndents } = require('common-tags');
const { Command } = require('discord-akairo');
const { PermissionsBitField } = require('discord.js');
const { isSameVoiceChannel } = require('../../modules/isSameVoiceChannel');
const { pushFormatFilter } = require('../../modules/pushFormatFilter');

module.exports = class CommandCustomFilter extends Command {
    constructor () {
        super('customfilter', {
            aliases: ['customfilter', 'cfilter', 'cf'],
            category: '📢 Filter',
            description: {
                text: 'Allows you to add a custom FFMPEG filter to the player.',
                usage: 'customfilter <argument>',
                details: stripIndents`
                \`<argument:str>\` The filter argument to provide to FFMPEG.
                :warning: If the argument is invalid or not supported by FFMPEG, the stream will prematurely end.
                `
            },
            channel: 'guild',
            ownerOnly: true,
            args: [
                {
                    id: 'custom',
                    match: 'rest'
                }
            ]
        });
    }

    async exec (message, args) {
        const djMode = this.client.settings.get(message.guild.id, 'djMode');
        const djRole = this.client.settings.get(message.guild.id, 'djRole');
        const dj = message.member.roles.cache.has(djRole) ||
            message.channel.permissionsFor(message.member.user.id).has(PermissionsBitField.Flags.ManageChannels);

        if (djMode) {
            if (!dj) {
                return this.client.ui.sendPrompt(message, 'DJ_MODE');
            }
        }

        if (!args.custom) return this.client.ui.usage(message, 'customfilter <argument>');

        const vc = message.member.voice.channel;
        if (!vc) return this.client.ui.sendPrompt(message, 'NOT_IN_VC');

        const queue = this.client.player.getQueue(message.guild.id);
        if (!queue) return this.client.ui.sendPrompt(message, 'NOT_PLAYING');

        const currentVc = this.client.vc.get(vc);
        if (currentVc) {
            if (args.custom === 'OFF'.toLowerCase()) {
                try {
                    await queue.filters.set('custom', null);
                    pushFormatFilter(queue, 'Custom Filter', 'Off');
                    return this.client.ui.custom(message, ':loudspeaker:', process.env.COLOR_INFO, '**Custom Filter** Removed');
                } catch (err) {
                    return this.client.ui.reply(message, 'error', 'No custom filters are applied to the player.');
                }
            } else {
                const custom = args.custom;
                await queue.filters.set('custom', custom);
                pushFormatFilter(queue, 'Custom Filter', custom);
                return this.client.ui.custom(message, ':loudspeaker:', process.env.COLOR_INFO, `**Custom Filter** Argument: \`${custom}\``);
            }
        } else {
            if (!isSameVoiceChannel(this.client, message.member, vc)) {
                return this.client.ui.sendPrompt(message, 'ALREADY_SUMMONED_ELSEWHERE');
            }
        }
    }
};
