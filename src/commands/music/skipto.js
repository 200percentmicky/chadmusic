/**
 *  ChadMusic - The Chad Music Bot
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
const { PermissionsBitField } = require('discord.js');
const { isSameVoiceChannel } = require('../../modules/isSameVoiceChannel');

module.exports = class CommandSkipTo extends Command {
    constructor () {
        super('skipto', {
            aliases: ['skipto', 'jumpto'],
            category: '🎶 Music',
            description: {
                text: 'Skips to the specified entry in the queue.',
                usage: '<int:queue_entry>',
                details: '`<int:queue_entry>` The number of the queue entry to skip to. Skips all other entries of the queue.'
            },
            channel: 'guild',
            clientPermissions: PermissionsBitField.Flags.EmbedLinks
        });
    }

    async exec (message) {
        const args = message.content.split(/ +/g);
        const djMode = this.client.settings.get(message.guild.id, 'djMode');
        const djRole = this.client.settings.get(message.guild.id, 'djRole');
        const dj = message.member.roles.cache.has(djRole) || message.channel.permissionsFor(message.member.user.id).has(PermissionsBitField.Flags.ManageChannels);
        if (djMode) {
            if (!dj) return this.client.ui.send(message, 'DJ_MODE');
        }

        const textChannel = this.client.settings.get(message.guild.id, 'textChannel', null);
        if (textChannel) {
            if (textChannel !== message.channel.id) {
                return this.client.ui.send(message, 'WRONG_TEXT_CHANNEL_MUSIC', textChannel);
            }
        }

        const vc = message.member.voice.channel;
        if (!vc) return this.client.ui.send(message, 'NOT_IN_VC');

        const currentVc = this.client.vc.get(vc);
        if (!this.client.player.getQueue(message) || !currentVc) return this.client.ui.send(message, 'NOT_PLAYING');
        else if (!isSameVoiceChannel(this.client, message.member, vc)) return this.client.ui.send(message, 'ALREADY_SUMMONED_ELSEWHERE');

        // For breaking use only.
        // this.client.player.skip(message)
        // return this.client.ui.reply(message, '⏭', process.env.COLOR_INFO, 'Skipped!')

        /*
    if (args[1] === ('--force' || '-f')) {
      if (!dj) return this.client.ui.reply(message, 'error', 'You must have the DJ role or the **Manage Channel** permission to use the `--force` flag.')
      this.client.player.skip(message)
      return this.client.ui.custom(message, '⏭', process.env.COLOR_INFO, 'Skipped!')
    }
    */

        const queue = this.client.player.getQueue(message);
        const song = queue.songs[args[1]];

        if (vc.members.size <= 2) {
            try {
                this.client.player.jump(message, parseInt(args[1]));
                await this.client.ui.custom(message, '⏭', process.env.COLOR_INFO, `Skipping to ${
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
                    this.client.player.jump(message, parseInt(args[1]));
                    await this.client.ui.custom(message, '⏭', process.env.COLOR_INFO, `Skipping to **${song.name}**...`);
                    return message.channel.sendTyping();
                } catch {
                    return this.client.ui.reply(message, 'error', 'Not a valid entry in the queue.');
                }
            } else {
                return this.client.ui.send(message, 'NOT_ALONE');
            }
        }
    }
};
