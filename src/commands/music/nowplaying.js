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
const { isSameVoiceChannel } = require('../../lib/isSameVoiceChannel');
const CMPlayerWindow = require('../../lib/CMPlayerWindow');

module.exports = class CommandNowPlaying extends Command {
    constructor () {
        super('nowplaying', {
            aliases: ['nowplaying', 'np'],
            category: '🎶 Music',
            description: {
                text: 'Shows the currently playing song.'
            },
            channel: 'guild',
            clientPermissions: PermissionsBitField.Flags.EmbedLinks
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

        const currentVc = this.client.vc.get(vc);
        if (!this.client.player.getQueue(message) || !currentVc) return this.client.ui.sendPrompt(message, 'NOT_PLAYING');
        else if (!isSameVoiceChannel(this.client, message.member, vc)) return this.client.ui.sendPrompt(message, 'ALREADY_SUMMONED_ELSEWHERE');

        const queue = this.client.player.getQueue(message);

        const song = queue.songs[0];
        const total = song.duration;
        const current = queue.currentTime;
        const author = song.uploader;

        const thumbnailSize = await this.client.settings.get(message.guild.id, 'thumbnailSize');

        let window = new CMPlayerWindow()
            .color(message.guild.members.me.displayColor !== 0 ? message.guild.members.me.displayColor : null)
            .windowTitle('Currently playing', message.guild.iconURL({ dynamic: true }))
            .trackTitle(song.name)
            .trackURL(song.url)
            .trackImage(thumbnailSize, song.thumbnail);

        if (song.isLive || song.metadata?.isRadio) {
            window.isLive();
        } else {
            window.timeBar(queue, total, current, 17);
        }

        let embedFields = [];

        embedFields.push({
            name: ':loud_sound: Voice Channel',
            value: `<#${currentVc.channel.id}>`,
            inline: true
        });

        if (song.ageRestricted) {
            embedFields.push({
                name: ':underage: Explicit',
                value: 'This track is **Age Restricted**',
                inline: true
            });
        }

        if (song.isFile) {
            embedFields.push({
                name: '📎 File',
                value: `${song.codec}`,
                inline: true
            });
        }

        if (author.name) {
            embedFields.push({
                name: ':arrow_upper_right: Uploader',
                value: `[${author.name}](${author.url})`,
                inline: true
            });
        }

        if (song.station) {
            embedFields.push({
                name: ':tv: Station',
                value: `${song.station}`,
                inline: true
            });
        }

        if (song.metadata?.silent && song.user.id !== message.member.user.id && !song.revealed) {
            window = new CMPlayerWindow()
                .color(message.guild.members.me.displayColor !== 0 ? message.guild.members.me.displayColor : null)
                .windowTitle('Currently playing', message.guild.iconURL({ dynamic: true }));

            embedFields = [];
            embedFields.push({
                name: '🔇 Silent',
                value: 'This track is hidden. The user that added this track can reveal it.'
            });
        } else if (song.metadata?.silent) {
            embedFields.push({
                name: '🔇 Silent',
                value: 'This track is hidden.',
                inline: true
            });
        }

        if (queue.paused) {
            const prefix = this.client.settings.get(message.guild.id, 'prefix', process.env.PREFIX);
            embedFields.push({
                name: '⏸ Paused',
                value: `Type '${prefix}resume' to resume playback.`,
                inline: true
            });
        }

        embedFields.push({
            name: `${this.client.ui.volumeEmoji(queue)} Volume`,
            value: `${queue.volume}%`,
            inline: true
        });

        embedFields.push({
            name: ':raising_hand: Requested by',
            value: `${song.user}`,
            inline: true
        });

        embedFields.push({
            name: '📢 Filters',
            value: `${queue.filters.filters.length > 0 ? `${queue.formattedFilters.map(x => `**${x.name}:** ${x.value}`).join('\n')}` : 'None'}`,
            inline: true
        });

        window
            .addFields(embedFields)
            .timestamp();

        return message.reply({ embeds: [window._embed] });
    }
};
