/// ChadMusic
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
const { EmbedBuilder } = require('discord.js');
const { isSameVoiceChannel } = require('../../lib/isSameVoiceChannel');

module.exports = class CommandSkip extends Command {
    constructor () {
        super('skip', {
            aliases: ['skip', 's'],
            category: '🎶 Music',
            description: {
                text: 'Skips the currently playing song.'
            },
            channel: 'guild'
        });
    }

    async exec (message) {
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

        const queue = this.client.player.getQueue(message.guild);

        const currentVc = this.client.vc.get(vc);
        if (!queue || !currentVc) return this.client.ui.sendPrompt(message, 'NOT_PLAYING');
        else if (!isSameVoiceChannel(this.client, message.member, vc)) return this.client.ui.sendPrompt(message, 'ALREADY_SUMMONED_ELSEWHERE');

        if (vc.members.size >= 3) {
            if (queue.votes.includes(message.member.user.id)) {
                return this.client.ui.reply(message, 'warn', 'You already voted to skip.');
            }

            queue.votes.push(message.member.user.id);

            const memberSize = vc.members.size;
            const botSize = vc.members.filter(x => x.user.bot).size;
            const votingPercent = this.client.settings.get(message.guild.id, 'votingPercent') ?? 0.5;
            const vcSize = Math.floor((memberSize - botSize) * votingPercent);
            const neededVotes = queue.votes.length >= vcSize;
            const votesLeft = Math.floor(vcSize - queue.votes.length);

            if (neededVotes) {
                queue.votes = [];
                if (!queue.songs[1]) {
                    this.client.player.stop(message.guild);
                    return this.client.ui.custom(message, ':checkered_flag:', process.env.COLOR_INFO, 'Reached the end of the queue.');
                }
                this.client.player.skip(message);
                await this.client.ui.custom(message, ':next_track:', process.env.COLOR_INFO, 'Skipping...');
                return message.channel.sendTyping();
            } else {
                const prefix = this.client.settings.get(message.guild.id, 'prefix', process.env.PREFIX);
                const embed = new EmbedBuilder()
                    .setColor(process.env.COLOR_INFO)
                    .setDescription(':track_next: Skipping?')
                    .setFooter({
                        text: `${votesLeft} more vote${votesLeft === 1 ? '' : 's'} needed to skip.${dj ? ` Yo DJ, you can force skip the track by using '${prefix}forceskip'.` : ''}`,
                        icon_url: message.member.user.avatarURL({ dynamic: true })
                    });
                return message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
            }
        } else {
            queue.votes = [];
            if (!queue.songs[1]) {
                this.client.player.stop(message.guild);
                return this.client.ui.custom(message, ':checkered_flag:', process.env.COLOR_INFO, 'Reached the end of the queue.');
            }
            this.client.player.skip(message.guild);
            await this.client.ui.custom(message, ':next_track:', process.env.COLOR_INFO, 'Skipping...');
            return message.channel.sendTyping();
        }
    }
};
