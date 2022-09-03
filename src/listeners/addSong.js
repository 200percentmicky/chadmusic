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

const { Listener } = require('discord-akairo');
const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const prettyms = require('pretty-ms');
const iheart = require('iheart');
const ffprobe = require('ffprobe');
const ffprobeStatic = require('ffprobe-static');
const { toColonNotation } = require('colon-notation');

const isAttachment = (url) => {
    // ! TODO: Come up with a better regex lol
    // eslint-disable-next-line no-useless-escape
    const urlPattern = /https?:\/\/(cdn\.)?(discordapp)\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/g;
    const urlRegex = new RegExp(urlPattern);
    return url.match(urlRegex);
};

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

        const djRole = await channel.client.settings.get(guild.id, 'djRole');
        const allowAgeRestricted = await channel.client.settings.get(guild.id, 'allowAgeRestricted');
        const maxTime = await channel.client.settings.get(guild.id, 'maxTime');
        const dj = member.roles.cache.has(djRole) || channel.permissionsFor(member.user.id).has(PermissionsBitField.Flags.ManageChannels);

        const userEmbed = new EmbedBuilder()
            .setColor(parseInt(process.env.COLOR_NO))
            .setAuthor({
                name: `${song.user.tag}`,
                iconURL: song.user.avatarURL({ dynamic: true })
            });

        if (!allowAgeRestricted) {
            if (!dj) {
                if (song.age_restricted) {
                    userEmbed.setDescription(`${process.env.EMOJI_NO} **${song.name}** cannot be added because **Age Restricted** tracks are not allowed on this server.`);
                    channel.send({ embeds: [userEmbed] });
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
                    userEmbed.setDescription(`${process.env.EMOJI_NO} **${song.name}** cannot be added to the queue since the duration of this song exceeds the max limit of \`${prettyms(maxTime, { colonNotation: true })}\` for this server.`);
                    channel.send({ embeds: [userEmbed] });
                    return queue.songs.pop();
                }
            }
        }

        if (await channel.client.radio.get(guild.id) !== undefined && !song.uploader.name) { // Assuming its a radio station.
            // Changes the description of the track, in case its a
            // radio station.
            await iheart.search(`${await channel.client.radio.get(guild.id)}`).then(match => {
                const station = match.stations[0];
                song.name = `${station.name} - ${station.description}`;
                song.isLive = true;
                song.thumbnail = station.logo || station.newlogo;
                song.station = `${station.frequency} ${station.band} - ${station.callLetters} ${station.city}, ${station.state}`;
            });
        }

        if (isAttachment(song.url)) {
            const supportedFormats = [
                'mp3',
                'mp4',
                'webm',
                'ogg',
                'wav'
            ];
            if (!supportedFormats.some(element => song.url.endsWith(element))) {
                queue.songs.pop();
                userEmbed.setColor(parseInt(process.env.COLOR_ERROR));
                userEmbed.setDescription(`${process.env.EMOJI_ERROR} The attachment is invalid. Supported formats: ${supportedFormats.map(x => `\`${x}\``).join(', ')}`);
                return channel.send({ embeds: [userEmbed] });
            } else {
                await ffprobe(song.url, { path: ffprobeStatic.path }).then(info => {
                    const time = Math.floor(info.streams[0].duration);
                    song.duration = time;
                    song.formattedDuration = toColonNotation(time + '000');
                    song.isFile = true;
                });
            }
        }

        // Stupid fix to make sure that the queue doesn't break.
        // TODO: Fix toColonNotation in queue.js
        if (song.isLive) song.duration = 1;

        if (!queue.songs[1]) return; // Don't send to channel if a player was created.
        if (queue.songs.indexOf(song) === 0) return;
        const embed = new EmbedBuilder()
            .setColor(guild.members.me.displayColor !== 0 ? guild.members.me.displayColor : null)
            .setAuthor({
                name: `Added to queue - ${member.voice.channel.name}`,
                iconURL: guild.iconURL({ dynamic: true })
            })
            .setTitle(song.name)
            .setURL(song.url)
            .setThumbnail(song.thumbnail)
            .setFooter({
                text: song.user.tag,
                iconURL: song.user.avatarURL({ dynamic: true })
            });

        channel.send({ embeds: [embed] });
    }
};
