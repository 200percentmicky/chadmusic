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
const { isSameVoiceChannel } = require('../../modules/isSameVoiceChannel');

module.exports = class CommandForceSkip extends Command {
    constructor () {
        super('forceskip', {
            aliases: ['forceskip', 'fs'],
            category: '🎶 Music',
            description: {
                text: 'Force skips the currently playing song, bypassing votes.'
            },
            channel: 'guild',
            clientPermissions: PermissionsBitField.Flags.EmbedLinks
        });
    }

    async exec (message) {
        const djMode = this.client.settings.get(message.guild.id, 'djMode');
        const djRole = this.client.settings.get(message.guild.id, 'djRole');
        const dj = message.member.roles.cache.has(djRole) || message.channel.permissionsFor(message.member.user.id).has(PermissionsBitField.Flags.ManageChannels);
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

        // For breaking use only.
        // this.client.player.skip(message)
        // return this.client.ui.reply(message, ':next_track:', process.env.COLOR_INFO, 'Skipped!')

        /*
    if (args[1] === ('--force' || '-f')) {
      if (!dj) return this.client.ui.reply(message, 'error', 'You must have the DJ role or the **Manage Channel** permission to use the `--force` flag.')
      this.client.player.skip(message)
      return this.client.ui.custom(message, ':next_track:', process.env.COLOR_INFO, 'Skipped!')
    }
    */

        const queue = this.client.player.getQueue(message);
        if (queue.votes.length > 0) queue.votes = [];

        if (vc.members.size <= 2) {
            if (!this.client.player.getQueue(message).songs[1]) {
                this.client.player.stop(message);
                return this.client.ui.custom(message, ':checkered_flag:', process.env.COLOR_INFO, 'Reached the end of the queue.');
            }
            this.client.player.skip(message);
            await this.client.ui.custom(message, ':next_track:', process.env.COLOR_INFO, 'Skipping...');
            return message.channel.sendTyping();
        } else {
            if (dj) {
                this.client.player.skip(message);
                await this.client.ui.custom(message, ':next_track:', process.env.COLOR_INFO, 'Skipping...');
                return message.channel.sendTyping();
            } else {
                return this.client.ui.sendPrompt(message, 'NOT_ALONE');
            }
        }
    }
};
