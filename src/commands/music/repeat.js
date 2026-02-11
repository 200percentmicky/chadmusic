/// ChadMusic
/// Copyright (C) 2026  Micky | 200percentmicky
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
const { isSameVoiceChannel } = require('../../lib/isSameVoiceChannel');
const { RepeatMode } = require('distube');

module.exports = class CommandRepeat extends Command {
    constructor () {
        super('repeat', {
            aliases: ['repeat', 'loop'],
            description: {
                text: 'Toggles repeat mode for the player.',
                usage: '[mode]',
                details: '`[mode]` The mode to apply for repeat mode. Valid options are **off**, **song**, or **queue**. Default is **song**.'
            },
            category: '🎶 Music',
            args: [
                {
                    id: 'mode'
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

        const player = this.client.player;
        const queue = player.getQueue(message);

        const vc = message.member.voice.channel;
        if (!vc) return this.client.ui.sendPrompt(message, 'NOT_IN_VC');

        const currentVc = this.client.vc.get(vc);

        if (!this.client.player.getQueue(message) || !currentVc) return this.client.ui.sendPrompt(message, 'NOT_PLAYING');
        else if (!isSameVoiceChannel(this.client, message.member, vc)) return this.client.ui.sendPrompt(message, 'ALREADY_SUMMONED_ELSEWHERE');

        if (vc.members.size <= 2 || dj) {
            const mode = {
                off: RepeatMode.DISABLED,
                song: RepeatMode.SONG,
                queue: RepeatMode.QUEUE
            };

            if (!args.mode) {
                if (queue.repeatMode !== RepeatMode.DISABLED) {
                    await queue.setRepeatMode(RepeatMode.DISABLED);
                } else {
                    await queue.setRepeatMode(RepeatMode.SONG);
                }
            } else {
                await queue.setRepeatMode(mode[args.mode]);
            }

            if (queue.repeatMode === RepeatMode.SONG) {
                queue.repeatTrack = queue.songs[0];
            } else {
                queue.repeatTrack = undefined;
            }

            const selectedMode = {
                song: '**🔂 Repeat Song**',
                queue: '**🔁 Repeat Queue**'
            };

            return this.client.ui.reply(message, 'ok', `${queue.repeatMode === RepeatMode.DISABLED
                ? 'Repeat has been disabled.'
                : `Enabled repeat to ${selectedMode[args.mode ?? 'song']}`
            }`);

            switch (args[1]) {
            case 'off': {
                await player.setRepeatMode(message, RepeatMode.DISABLED);
                this.client.ui.reply(message, 'ok', 'Repeat has been disabled.');
                break;
            }
            case 'song': {
                await player.setRepeatMode(message, RepeatMode.SONG);
                this.client.ui.reply(message, 'ok', 'Enabled repeat to **🔂 Repeat Song**');
                break;
            }
            case 'queue': {
                await player.setRepeatMode(message, RepeatMode.QUEUE);
                this.client.ui.reply(message, 'ok', 'Enabled repeat to **🔁 Repeat Queue**');
                break;
            }
            default: {
                if (queue.repeatMode !== 0) {
                    await player.setRepeatMode(message, RepeatMode.DISABLED);
                    this.client.ui.reply(message, 'ok', 'Repeat has been disabled.');
                    break;
                }
                await player.setRepeatMode(message, RepeatMode.SONG);
                this.client.ui.reply(message, 'ok', 'Enabled repeat to **🔂 Repeat Song**');
                break;
            }
            }
        } else {
            return this.client.ui.sendPrompt(message, 'NOT_ALONE');
        }
    }
};
