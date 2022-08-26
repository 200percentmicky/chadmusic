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

const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const prettyms = require('pretty-ms');

async function nowPlayingMsg (queue, song) {
    const channel = queue.textChannel; // TextChannel
    const guild = channel.guild; // Guild
    const member = guild.members.cache?.get(queue.songs[queue.songs.length - 1]?.user.id); // GuildMember
    const vc = member.voice.channel; // VoiceChannel

    if (queue.songs.length === 1) { // If someone started a new queue.
        const djRole = await channel.client.settings.get(guild.id, 'djRole');
        const allowAgeRestricted = await channel.client.settings.get(guild.id, 'allowAgeRestricted', true);
        const maxTime = await channel.client.settings.get(guild.id, 'maxTime');

        const userEmbed = new EmbedBuilder()
            .setColor(parseInt(process.env.COLOR_NO))
            .setAuthor({
                name: `${song.user.tag}`,
                iconURL: song.user.avatarURL({ dynamic: true })
            });

        // Check if this member is a DJ
        const dj = member.roles.cache.has(djRole) || channel.permissionsFor(member.user.id).has(PermissionsBitField.Flags.ManageChannels);
        if (!allowAgeRestricted) {
            if (!dj) {
                if (song.age_restricted) {
                    channel.client.player.stop(guild);
                    userEmbed.setDescription(`${process.env.EMOJI_NO} **${song.name}** cannot be added because **Age Restricted** tracks are not allowed on this server.`);
                    return channel.send({ embeds: [userEmbed] });
                }
            }
        }
        if (maxTime) {
            if (!dj) {
                // DisTube provide the duration as a decimal.
                // Using Math.floor() to round down.
                // Still need to apend '000' to be accurate.
                if (parseInt(Math.floor(song.duration + '000')) > maxTime) {
                    channel.client.player.stop(guild);
                    userEmbed.setDescription(`${process.env.EMOJI_NO} You cannot add this song to the queue since the duration of this song exceeds the max limit of \`${prettyms(maxTime, { colonNotation: true })}\` for this server.`);
                    return channel.send({ embeds: [userEmbed] });
                }
            }
        }
    }

    // Stupid fix to make sure that the queue doesn't break.
    // TODO: Fix toColonNotation in queue.js
    if (song.isLive) song.duration = 1;

    const author = song.uploader; // Video Uploader

    const songNow = new EmbedBuilder()
        .setColor(guild.members.me.displayColor !== 0 ? guild.members.me.displayColor : null)
        .setAuthor({
            name: `Now playing in ${vc.name}`,
            iconURL: guild.iconURL({ dynamic: true })
        });

    if (song.age_restricted) songNow.addField(':underage: Explicit', 'This track is **Age Restricted**'); // Always 'false'. Must be a bug in ytdl-core.
    if (song.isFile) songNow.setDescription('📎 **File Upload**');
    if (author.name) songNow.addField(':arrow_upper_right: Uploader', `[${author.name}](${author.url})` || 'N/A');
    if (song.station) songNow.addField(':tv: Station', `${song.station}`);

    songNow
        .addField(':raising_hand: Requested by', `${song.user}`, true)
        .addField(':hourglass: Duration', `${song.isLive ? '🔴 **Live**' : song.duration > 0 ? song.formattedDuration : 'N/A'}`, true)
        .setTitle(`${song.name}`)
        .setURL(song.url)
        .setThumbnail(song.thumbnail)
        .setTimestamp();

    channel.send({ embeds: [songNow] });
}

module.exports = { nowPlayingMsg };
