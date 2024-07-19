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

const { Listener } = require('discord-akairo');
const CMPlayerWindow = require('../lib/CMPlayerWindow.js');
const { Events } = require('distube');

module.exports = class ListenerPlaySong extends Listener {
    constructor () {
        super('playSong', {
            emitter: 'player',
            event: Events.PLAY_SONG
        });
    }

    async exec (queue, song) {
        // The event is being called way too quickly for metadata to be parsed correctly
        // when a player is created. Using a setTimeout() here will allow for metadata to be parsed correctly.
        setTimeout(async () => {
            const channel = queue.textChannel; // TextChannel
            const guild = channel.guild; // Guild
            const member = guild.members.cache?.get(queue.songs[queue.songs.length - 1]?.user.id); // GuildMember
            const vc = member.voice.channel ?? guild.members.me.voice.channel; // VoiceChannel

            // Stupid fix to make sure that the queue doesn't break.
            // TODO: Fix toColonNotation in queue.js
            if (song.isLive) song.duration = 1;

            const author = song.uploader; // Video Uploader
            const thumbnailSize = await channel.client.settings.get(guild.id, 'thumbnailSize');

            const window = new CMPlayerWindow()
                .color(guild.members.me.displayColor !== 0 ? guild.members.me.displayColor : null)
                .windowTitle('Now playing', guild.iconURL({ dynamic: true }))
                .trackTitle(`[${song.name}](${song.url})`)
                .trackImage(thumbnailSize, song.thumbnail);

            const songNowFields = [];

            songNowFields.push({
                name: ':loud_sound: Voice Channel',
                value: `<#${vc.id}>`,
                inline: true
            });

            if (song.ageRestricted) {
                songNowFields.push({
                    name: ':underage: Explicit',
                    value: 'This track is **Age Restricted**',
                    inline: true
                }); // Only for YouTube so far...
            }

            if (song.isFile) {
                songNowFields.push({
                    name: '📎 File',
                    value: `${song.codec}`,
                    inline: true
                });
            }

            if (author.name) {
                songNowFields.push({
                    name: ':arrow_upper_right: Uploader',
                    value: `[${author.name}](${author.url})` || 'N/A',
                    inline: true
                });
            }

            if (song.station) {
                songNowFields.push({
                    name: ':tv: Station',
                    value: `${song.station}`,
                    inline: true
                });
            }

            songNowFields.push({
                name: ':hourglass: Duration',
                value: `${song.isLive || song.metadata?.isRadio ? '🔴 **Live**' : song.duration > 0 ? song.formattedDuration : 'N/A'}`,
                inline: true
            });

            songNowFields.push({
                name: ':raising_hand: Requested by',
                value: `${song.user}`,
                inline: true
            });

            window
                .addFields(songNowFields)
                .timestamp();

            try {
                if (channel.id !== song.metadata?.ctx.channelID) {
                    await channel.send({ embeds: [window._embed] });
                } else {
                    if (song.metadata?.silent) {
                        if (queue.songs.length === 1) {
                            // Again, only if someone started a new queue, but with a silent track.
                            return await song.metadata?.ctx.send({ embeds: [window._embed] });
                        } else return;
                    }
                    await song.metadata?.ctx.send({ embeds: [window._embed] });
                }
            } catch {
                channel.send({ embeds: [window._embed] });
            }

            const status = `${process.env.EMOJI_MUSIC} ${song.name} [${song.formattedDuration}] (${song.user.displayName} - ${song.user.username})`;
            await channel.client.utils.setVcStatus(vc, status.length > 500 ? status.substring(0, 496) + '...' : status);
        }, 500);
    }
};
