/**
 *  Micky-bot
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
const { MessageEmbed } = require('discord.js');
const { splitBar } = require('string-progressbar');
const { isSameVoiceChannel } = require('../../modules/isSameVoiceChannel');

module.exports = class CommandNowPlaying extends Command {
    constructor () {
        super('nowplaying', {
            aliases: ['nowplaying', 'np'],
            category: '🎶 Music',
            description: {
                text: 'Shows the currently playing song.'
            },
            channel: 'guild',
            clientPermissions: ['EMBED_LINKS']
        });
    }

    async exec (message) {
        const djMode = this.client.settings.get(message.guild.id, 'djMode');
        const djRole = this.client.settings.get(message.guild.id, 'djRole');
        const dj = message.member.roles.cache.has(djRole) || message.channel.permissionsFor(message.member.user.id).has(['MANAGE_CHANNELS']);
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

        const queue = this.client.player.getQueue(message);

        const song = queue.songs[0];
        const total = song.duration;
        const current = queue.currentTime;
        const author = song.uploader;

        let progressBar;
        if (!song.isLive) progressBar = splitBar(total, current, 17)[0];
        const duration = song.isLive ? '🔴 **Live**' : `${queue.formattedCurrentTime} [${progressBar}] ${song.formattedDuration}`;
        const embed = new MessageEmbed()
            .setColor(message.guild.me.displayColor !== 0 ? message.guild.me.displayColor : null)
            .setAuthor({
                name: `Currently playing in ${currentVc.channel.name}`,
                iconURL: message.guild.iconURL({ dynamic: true })
            })
            .setDescription(`${duration}`)
            .setTitle(song.name)
            .setURL(song.url)
            .setThumbnail(song.thumbnail);

        if (queue.paused) {
            const prefix = this.client.settings.get(message.guild.id, 'prefix', process.env.PREFIX);
            embed.addField('⏸ Paused', `Type '${prefix}resume' to resume playback.`);
        }

        if (song.age_restricted) {
            embed.addField(':underage: Explicit', 'This track is **Age Restricted**');
        }

        if (author.name) embed.addField(':arrow_upper_right: Uploader', `[${author.name}](${author.url})`);
        if (song.station) embed.addField(':tv: Station', `${song.station}`);

        const volumeEmoji = () => {
            const volume = queue.volume;
            const volumeIcon = {
                50: '🔈',
                100: '🔉',
                150: '🔊'
            };
            if (volume >= 175) return '🔊😭👌';
            return volumeIcon[Math.round(volume / 50) * 50];
        };

        embed
            .addField(':raising_hand: Requested by', `${song.user}`, true)
            .addField(`${volumeEmoji()} Volume`, `${queue.volume}%`, true)
            .addField('📢 Filters', `${queue.filters.length > 0 ? `${queue.formattedFilters.map(x => `**${x.name}:** ${x.value}`).join('\n')}` : 'None'}`)
            .setTimestamp();

        return message.channel.send({ embeds: [embed] });
    }
};
