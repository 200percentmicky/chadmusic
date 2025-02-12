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

const { Command } = require('discord-akairo');

module.exports = class CommandBindChannel extends Command {
    constructor () {
        super('changechannel', {
            aliases: ['bindchannel', 'bindto', 'bc'],
            category: '🎶 Music',
            description: {
                text: 'Changes the player\'s currently binded text channel to a different one.',
                usage: 'bindchannel [channel]',
                details: '`[channel]` The new text channel to bind to. Also supports text-in-voice channels, forum channels, and threads. If nothing was provided or the channel is invalid, binds to the text channel that the command was used in.'
            },
            channel: 'guild',
            args: [
                {
                    type: 'channel',
                    id: 'channel'
                }
            ]
        });
    }

    async exec (message, args) {
        const djMode = this.client.settings.get(message.guild.id, 'djMode');
        const dj = await this.client.utils.isDJ(message.channel, message.member);
        if (djMode) {
            if (!dj) return this.client.ui.sendPrompt(message, 'DJ_MODE');
        }

        if (!dj) return this.client.ui.sendPrompt(message, 'NO_DJ');

        const vc = message.member.voice.channel;
        if (!vc) return this.client.ui.sendPrompt(message, 'NOT_IN_VC');

        const currentVc = this.client.vc.get(vc);

        if (!this.client.player.getQueue(message) || !currentVc) return this.client.ui.sendPrompt(message, 'NOT_PLAYING');

        const queue = this.client.player.getQueue(message.guild);
        let newBindChannel;

        if (args.channel) {
            try {
                newBindChannel = await message.guild.channels.fetch(args.channel.id);
            } catch {
                newBindChannel = message.channel;
            }
        } else {
            newBindChannel = message.channel;
        }

        queue.textChannel = newBindChannel;

        return this.client.ui.reply(message, 'ok', `Now binded to <#${newBindChannel.id}>`);
    }
};
