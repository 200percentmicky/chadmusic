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

// eslint-disable-next-line no-unused-vars
const { Client, GuildMember, BaseGuildVoiceChannel } = require('discord.js');

/**
 * Verifys if the user is in the same voice channel as the client.
 * @param {Client} client Discord Client
 * @param {GuildMember} member GuildMember
 * @param {BaseGuildVoiceChannel} vc The voice channel.
 * @returns boolean
 */
function isSameVoiceChannel (client, member, vc) {
    const queue = client.player?.getQueue(member.guild);
    let channelId;
    try {
        channelId = queue.voice?.connection.joinConfig.channelId;
    } catch {
        channelId = client.vc.get(vc).channel.id;
    }

    return channelId === vc.id;
}

module.exports = { isSameVoiceChannel };
