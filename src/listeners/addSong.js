/// ChadMusic - The Chad Music Bot
/// Copyright (C) 2023  Micky D. | @200percentmicky | Micky-kun#3836
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
const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const prettyms = require('pretty-ms');
const ffprobe = require('ffprobe');
const ffprobeStatic = require('ffprobe-static');
const { toColonNotation } = require('colon-notation');

module.exports = class ListenerAddSong extends Listener {
    constructor () {
        super('addSong', {
            emitter: 'player',
            event: 'addSong'
        });
    }

    async exec (queue, song) {
        const channel = queue.textChannel;
        const guild = channel.guild;
        const member = guild.members.cache.get(queue.songs[queue.songs.length - 1].user.id);
        const message = song.metadata?.message || song.metadata?.ctx;

        const djRole = await channel.client.settings.get(guild.id, 'djRole');
        const allowAgeRestricted = await channel.client.settings.get(guild.id, 'allowAgeRestricted');
        const maxTime = await channel.client.settings.get(guild.id, 'maxTime');
        const dj = member.roles.cache.has(djRole) || channel.permissionsFor(member.user.id).has(PermissionsBitField.Flags.ManageChannels);

        if (!allowAgeRestricted) {
            if (!dj) {
                if (song.age_restricted) {
                    this.client.ui.reply(message, 'no', `${process.env.EMOJI_NO} **${song.name}** cannot be added because **Age Restricted** tracks are not allowed on this server.`);
                    return queue.songs.pop();
                }
            }
        }

        if (maxTime) {
            if (!dj) {
                // DisTube provide the duration as a decimal.
                // Using Math.floor() to round down.
                // Still need to apend '000' to be accurate.
                if (parseInt(Math.floor(song.duration + '000')) > maxTime) {
                    this.client.ui.reply(song.metadata?.message, 'no', `**${song.name}** cannot be added to the queue since the duration of this song exceeds the max limit of \`${prettyms(maxTime, { colonNotation: true })}\` for this server.`);
                    return queue.songs.pop();
                }
            }
        }

        // If its a live radio station, lets add some extra info to it.
        if (song.metadata?.isRadio) {
            const station = song.metadata?.radioStation;

            song.name = `${station.name} - ${station.description}`;
            song.isLive = true;
            song.thumbnail = station.logo || station.newlogo;
            song.station = `${station.frequency} ${station.band} - ${station.callLetters} ${station.city}, ${station.state}`;
        }

        // Check if ffprobe can find any any additional metadata if none is available.
        if (this.client.utils.hasExt(song.url)) {
            await ffprobe(song.url, { path: ffprobeStatic.path }).then(info => {
                if (song.metadata?.isRadio) return;

                // Ffmpeg parses images as videos with just one single frame. So, to check
                // whether the file is a video or an audio file, the best way would be to
                // check whether the file has a duration. Texts files do have a duration. It's
                // probably used to measure how many lines the file has, so it's codec name
                // will be checked instead.
                if (!info.streams[0].duration || info.streams[0].codec_name === 'ansi') {
                    this.client.ui.reply(song.metadata?.message, 'error', 'The attachment must be an audio or a video file.');
                    return queue.songs.pop();
                }

                const time = Math.floor(info.streams[0].duration);
                song.isFile = true;
                song.duration = time;
                song.formattedDuration = toColonNotation(time + '000');
                song.codec = `${info.streams[0].codec_long_name} (\`${info.streams[0].codec_name}\`)`;
            }).catch(() => {});
        }

        // Stupid fix to make sure that the queue doesn't break.
        // TODO: Fix toColonNotation in queue.js
        if (song.isLive) song.duration = 1;

        let songTitle = song.name;
        if (songTitle.length > 256) songTitle = song.name.substring(0, 252) + '...';

        if (!queue.songs[1]) return; // Don't send to channel if a player was created.
        if (queue.songs.indexOf(song) === 0) return;
        const embed = new EmbedBuilder()
            .setColor(guild.members.me.displayColor !== 0 ? guild.members.me.displayColor : null)
            .setAuthor({
                name: `Added to queue - ${member.voice.channel.name}`,
                iconURL: guild.iconURL({ dynamic: true })
            })
            .setTitle(`${songTitle}`)
            .setURL(song.url)
            .setThumbnail(song.thumbnail)
            .setFooter({
                text: song.user.tag,
                iconURL: song.user.avatarURL({ dynamic: true })
            });

        if (song.metadata?.silent) {
            embed.setAuthor({
                name: `Added silently to the queue - ${member.voice.channel.name}`,
                iconURL: guild.iconURL({ dynamic: true })
            });
        }

        try {
            song.metadata?.ctx.send({ embeds: [embed] });
        } catch {
            channel.send({ embeds: [embed] });
        }
    }
};
