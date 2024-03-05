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

const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const prettyms = require('pretty-ms');

async function nowPlayingMsg (queue, song) {
    const channel = queue.textChannel; // TextChannel
    const guild = channel.guild; // Guild
    const member = guild.members.cache?.get(queue.songs[queue.songs.length - 1]?.user.id); // GuildMember
    const vc = member.voice.channel ?? guild.members.me.voice.channel; // VoiceChannel
    const message = song.metadata?.message || song.metadata?.ctx;

    if (queue.songs.length === 1) { // If someone started a new queue.
        const djRole = await channel.client.settings.get(guild.id, 'djRole');
        const allowAgeRestricted = await channel.client.settings.get(guild.id, 'allowAgeRestricted', true);
        const maxTime = await channel.client.settings.get(guild.id, 'maxTime');

        // Check if this member is a DJ
        const dj = member.roles.cache.has(djRole) || channel.permissionsFor(member.user.id).has(PermissionsBitField.Flags.ManageChannels);
        if (!allowAgeRestricted) {
            if (!dj) {
                if (song.age_restricted) {
                    channel.client.player.stop(guild);
                    return this.client.ui.reply(message, 'no', `**${song.name}** cannot be added because **Age Restricted** tracks are not allowed on this server.`);
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
                    return this.client.ui.reply(message, 'no', `You cannot add this song to the queue since the duration of this song exceeds the max limit of \`${prettyms(maxTime, { colonNotation: true })}\` for this server.`);
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
            name: 'Now playing',
            iconURL: guild.iconURL({ dynamic: true })
        });

    const songNowFields = [];

    songNowFields.push({
        name: ':loud_sound: Voice Channel',
        value: `<#${vc.id}>`,
        inline: true
    });

    if (song.age_restricted) {
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

    let songTitle = song.name;
    if (songTitle.length > 256) songTitle = song.name.substring(0, 252) + '...';

    songNow
        .addFields(songNowFields)
        .setTitle(`${songTitle}`)
        .setURL(song.url)
        .setTimestamp();

    const thumbnailSize = await channel.client.settings.get(guild.id, 'thumbnailSize');

    switch (thumbnailSize) {
    case 'small': {
        songNow.setThumbnail(song.thumbnail);
        break;
    }
    case 'large': {
        songNow.setImage(song.thumbnail);
        break;
    }
    }

    try {
        if (channel.id !== song.metadata?.ctx.channelID) {
            await channel.send({ embeds: [songNow] });
        } else {
            if (song.metadata?.silent) {
                if (queue.songs.length === 1) {
                    // Again, only if someone started a new queue, but with a silent track.
                    return await song.metadata?.ctx.send({ embeds: [songNow] });
                } else return;
            }
            await song.metadata?.ctx.send({ embeds: [songNow] });
        }
    } catch {
        channel.send({ embeds: [songNow] });
    }

    await channel.client.utils.setVcStatus(vc, `${process.env.EMOJI_MUSIC} ${song.name} [${song.formattedDuration}]`);
}

module.exports = { nowPlayingMsg };
