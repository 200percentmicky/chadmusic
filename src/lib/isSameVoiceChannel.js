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

// eslint-disable-next-line no-unused-vars
const { Client, GuildMember, BaseGuildVoiceChannel } = require('discord.js');
const { useMainPlayer, useQueue } = require('discord-player');

/**
 * Verifys if the user is in the same voice channel as the client.
 * @param {Client} client Discord Client
 * @param {GuildMember} member GuildMember
 * @param {BaseGuildVoiceChannel} vc The voice channel.
 * @returns boolean
 */
function isSameVoiceChannel (client, member, vc) {
    const player = useMainPlayer();
    const queue = useQueue(member.guild.id);
    const connection = player.voiceUtils.getConnection(member.guild.id);
    let channelId;
    try {
        channelId = queue.channel?.id;
    } catch {
        channelId = connection.joinConfig.channelId;
    }

    return channelId === vc.id;
}

module.exports = { isSameVoiceChannel };
