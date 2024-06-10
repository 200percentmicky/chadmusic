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
const prettyms = require('pretty-ms');
const ffprobe = require('ffprobe');
const ffprobeStatic = require('ffprobe-static');
const { toColonNotation } = require('colon-notation');
const CMPlayerWindow = require('../modules/CMPlayerWindow');

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

        const allowAgeRestricted = await channel.client.settings.get(guild.id, 'allowAgeRestricted');
        const maxTime = await channel.client.settings.get(guild.id, 'maxTime');
        const maxQueueLimit = await channel.client.settings.get(guild.id, 'maxQueueLimit');
        const dj = await this.client.utils.isDJ(channel, member);

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
            try {
                const info = await ffprobe(song.url, { path: ffprobeStatic.path });

                // Ffmpeg parses images as videos with just one single frame. So, to check
                // whether the file is a video or an audio file, the best way would be to
                // check whether the file has a duration. Texts files do have a duration. It's
                // probably used to measure how many lines the file has, so it's codec name
                // will be checked instead.
                if (!info.streams[0].duration || info.streams[0].codec_name === 'ansi') {
                    this.client.ui.reply(message, 'error', 'The attachment must be an audio or a video file.');
                    if (queue.songs.length === 1) return this.client.player.stop(guild);
                    else return queue.songs.pop();
                }

                const time = Math.floor(info.streams[0].duration);
                song.isFile = true;
                song.duration = time;
                song.formattedDuration = toColonNotation(time + '000');
                song.codec = `${info.streams[0].codec_long_name} (\`${info.streams[0].codec_name}\`)`;
            } catch {
                this.client.ui.reply(message, 'error', 'Invalid data was provided while processing the file, or the file is not supported.');
                if (queue.songs.length === 1) return this.client.player.stop(guild);
                else return queue.songs.pop();
            }
        }

        if (!allowAgeRestricted) {
            if (!dj) {
                if (song.age_restricted) {
                    if (queue.songs.length === 1) channel.client.player.stop(guild);
                    else queue.songs.pop();
                    return channel.client.ui.reply(message, 'no', `${process.env.EMOJI_NO} **${song.name}** cannot be added because **Age Restricted** tracks are not allowed on this server.`);
                }
            }
        }

        if (maxTime) {
            if (!dj) {
                if (song.isLive || song.metadata?.isRadio) {
                    if (queue.songs.length === 1) channel.client.player.stop(guild);
                    else queue.songs.pop();
                    return this.client.ui.reply(message, 'no', `You can't add **${song.name}** to the queue. Live streams and radio broadcasts can't be added while a max time limit is set on this server.`);
                }

                // DisTube provide the duration as a decimal.
                // Using Math.floor() to round down.
                // Still need to apend '000' to be accurate.
                if (parseInt(Math.floor(song.duration + '000')) > maxTime) {
                    if (queue.songs.length === 1) channel.client.player.stop(guild);
                    else queue.songs.pop();
                    return this.client.ui.reply(message, 'no', `You can't add **${song.name}** to the queue. The duration of that track exceeds the max time allowed on this server. (\`${prettyms(maxTime, { colonNotation: true })}\`).`);
                }
            }
        }

        if (maxQueueLimit) {
            const queueMemberSize = queue.songs.filter(entries => entries.user.id === message.member.user.id).length;
            if (queueMemberSize > maxQueueLimit) {
                if (queue.songs.length === 1) channel.client.player.stop(guild); // Probably doesn't matter in the slightest.
                else queue.songs.pop();
                return this.client.ui.reply(message, 'no', `You are only allowed to add a max of ${maxQueueLimit} track(s) to the queue.`);
            }
        }

        // Stupid fix to make sure that the queue doesn't break.
        // TODO: Fix toColonNotation in queue.js
        if (song.isLive) song.duration = 1;

        if (!queue.songs[1]) return; // Don't send to channel if a player was created.
        if (queue.songs.indexOf(song) === 0) return;
        const window = new CMPlayerWindow()
            .color(guild.members.me.displayColor !== 0 ? guild.members.me.displayColor : null)
            .windowTitle(`Added to queue - ${member.voice.channel.name}`, guild.iconURL({ dynamic: true }))
            .trackTitle(`[${song.name}](${song.url})`)
            .trackImage('small', song.thumbnail)
            .setFooter(`${song.user.globalName} - ${song.user.tag.replace(/#0{1,1}$/, '')}`, song.user.avatarURL({ dynamic: true }));

        if (song.metadata?.silent) {
            window.windowTitle(`Added silently to the queue - ${member.voice.channel.name}`, guild.iconURL({ dynamic: true }));
        }

        try {
            song.metadata?.ctx.send({ embeds: [window._embed] });
        } catch {
            channel.send({ embeds: [window._embed] });
        }
    }
};
