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

const { PermissionsBitField, BaseGuildTextChannel, GuildMember } = require('discord.js'); // eslint-disable-line no-unused-vars

/**
 * Checks if a user is a DJ in a guild.
 * @param {BaseGuildTextChannel} channel A text channel.
 * @param {GuildMember} member The guild member to check for DJ permissions.
 * @returns {boolean}
 */
const isDJ = (channel, member) => {
    const djRole = channel.client.settings.get(channel.guild.id, 'djRole');
    const permission = member.roles.cache.has(djRole) ||
    channel.permissionsFor(member.user.id).has(PermissionsBitField.Flags.ManageChannels) ||
        member.user.id === process.env.OWNER_ID;

    return permission;
};

module.exports = { isDJ };
