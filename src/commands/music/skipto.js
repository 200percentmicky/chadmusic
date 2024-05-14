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
const { isSameVoiceChannel } = require('../../modules/isSameVoiceChannel');

module.exports = class CommandSkipTo extends Command {
    constructor () {
        super('skipto', {
            aliases: ['skipto', 'jumpto', 'jump'],
            category: '🎶 Music',
            description: {
                text: 'Skips to the specified entry in the queue.',
                usage: '<queue_entry>',
                details: '`<queue_entry>` The number of the queue entry to skip to. Skips all other entries of the queue.'
            },
            channel: 'guild',
            args: [
                {
                    id: 'entry',
                    type: 'number',
                    match: 'text'
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

        const textChannel = this.client.settings.get(message.guild.id, 'textChannel', null);
        if (textChannel) {
            if (textChannel !== message.channel.id) {
                return this.client.ui.sendPrompt(message, 'WRONG_TEXT_CHANNEL_MUSIC', textChannel);
            }
        }

        const vc = message.member.voice.channel;
        if (!vc) return this.client.ui.sendPrompt(message, 'NOT_IN_VC');

        const currentVc = this.client.vc.get(vc);
        if (!this.client.player.getQueue(message) || !currentVc) return this.client.ui.sendPrompt(message, 'NOT_PLAYING');
        else if (!isSameVoiceChannel(this.client, message.member, vc)) return this.client.ui.sendPrompt(message, 'ALREADY_SUMMONED_ELSEWHERE');

        const queue = this.client.player.getQueue(message);
        const song = queue.songs[args.entry];

        if (vc.members.size <= 2) {
            try {
                this.client.player.jump(message, parseInt(args.entry));
                await this.client.ui.custom(message, ':next_track:', process.env.COLOR_INFO, `Skipping to ${
                    song.metadata?.silent
                        ? 'a hidden track'
                        : `**${song.name}**`
                }...`);
                return message.channel.sendTyping();
            } catch {
                return this.client.ui.reply(message, 'error', 'Not a valid entry in the queue.');
            }
        } else {
            if (dj) {
                try {
                    this.client.player.jump(message, parseInt(args.entry));
                    await this.client.ui.custom(message, ':next_track:', process.env.COLOR_INFO, `Skipping to **${song.name}**...`);
                    return message.channel.sendTyping();
                } catch {
                    return this.client.ui.reply(message, 'error', 'Not a valid entry in the queue.');
                }
            } else {
                return this.client.ui.sendPrompt(message, 'NOT_ALONE');
            }
        }
    }
};
