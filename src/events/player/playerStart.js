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
const CMPlayerWindow = require('../../lib/CMPlayerWindow');
const { GuildQueueEvent } = require('discord-player');

module.exports = class ListenerPlayerStart extends Listener {
    constructor () {
        super('playerStart', {
            emitter: 'playerEvents',
            event: GuildQueueEvent.PlayerStart
        });
    }

    async exec (queue, track) {
        // The event is being called way too quickly for metadata to be parsed correctly
        // when a player is created. Using a setTimeout() here will allow for metadata to be parsed correctly.
        setTimeout(async () => {
            const channel = queue.metadata?.textChannel; // TextChannel
            const guild = queue.guild; // Guild
            const member = track.member; // GuildMember
            const vc = member.voice.channel ?? guild.members.me.voice.channel; // VoiceChannel

            // Stupid fix to make sure that the queue doesn't break.
            // TODO: Fix toColonNotation in queue.js
            // if (track.raw.live) song.duration = 1;

            const author = track.author; // Video Uploader
            const thumbnailSize = await channel.client.settings.get(guild.id, 'thumbnailSize');

            const window = new CMPlayerWindow()
                .color(guild.members.me.displayColor !== 0 ? guild.members.me.displayColor : null)
                .windowTitle('Now playing', guild.iconURL({ dynamic: true }))
                .trackTitle(`[${track.title}](${track.url})`)
                .trackImage(thumbnailSize, track.thumbnail);

            const songNowFields = [];

            songNowFields.push({
                name: ':loud_sound: Voice Channel',
                value: `<#${vc.id}>`,
                inline: true
            });

            /*
            if (song.ageRestricted) {
                songNowFields.push({
                    name: ':underage: Explicit',
                    value: 'This track is **Age Restricted**',
                    inline: true
                }); // Only for YouTube so far...
            }
            */

            if (track.metadata?.file) {
                songNowFields.push({
                    name: '📎 File',
                    value: `${track.codec}`,
                    inline: true
                });
            }

            if (author) {
                songNowFields.push({
                    name: ':arrow_upper_right: Uploader',
                    value: `${author}`, // `${author.url ? `[${author.name}](${author.url})` : `${author.name}`}` || 'N/A',
                    inline: true
                });
            }

            if (track.metadata?.station) {
                songNowFields.push({
                    name: ':tv: Station',
                    value: `${track.station}`,
                    inline: true
                });
            }

            songNowFields.push({
                name: ':hourglass: Duration',
                value: `${track.raw.live || track.metadata?.isRadio ? '🔴 **Live**' : track.durationMS > 0 ? track.duration : 'N/A'}`,
                inline: true
            });

            songNowFields.push({
                name: ':raising_hand: Requested by',
                value: `${member}`,
                inline: true
            });

            window
                .addFields(songNowFields)
                .timestamp();

            try {
                if (channel.id !== track.metadata?.ctx.channelID) {
                    await channel.send({ embeds: [window._embed] });
                } else {
                    if (track.metadata?.silent) {
                        if (queue.songs.length === 1) {
                            // Again, only if someone started a new queue, but with a silent track.
                            return await track.metadata?.ctx.send({ embeds: [window._embed] });
                        } else return;
                    }
                    await track.metadata?.ctx.send({ embeds: [window._embed] });
                }
            } catch {
                channel.send({ embeds: [window._embed] });
            }

            const status = `${process.env.EMOJI_MUSIC} ${track.title} [${track.duration}] (${member?.user.displayName} - ${member?.user.username})`;
            await channel.client.utils.setVcStatus(vc, status.length > 500 ? status.substring(0, 496) + '...' : status);

            queue.totalErrors = 0;
        }, 500);
    }
};
