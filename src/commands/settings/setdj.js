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

const { Command } = require('discord-akairo');
const { PermissionsBitField } = require('discord.js');

module.exports = class CommandSetDJ extends Command {
    constructor () {
        super('setdj', {
            aliases: ['setdj'],
            category: '⚙ Settings',
            description: {
                text: 'Sets the DJ Role for this server.',
                usage: '[role:none/off]',
                details: '`[role:none/off]` The role you would like to set. Can be the name, the ID, or a mention of the role.'
            },
            clientPermissions: [PermissionsBitField.Flags.EmbedLinks],
            userPermissions: [PermissionsBitField.Flags.ManageGuild],
            args: [
                {
                    id: 'role',
                    match: 'rest'
                }
            ]
        });
    }

    async exec (message, args) {
        const role = message.mentions.roles.first() ||
            message.guild.roles.cache.get(args.role) ||
            message.guild.roles.cache.find(val => val.name === args.role);

        if (!args.role) {
            await this.client.settings.delete(message.guild.id, 'djRole');
            return this.client.ui.reply(message, 'ok', 'The DJ role has been removed.');
        }
        if (!role) return this.client.ui.reply(message, 'error', `\`${args.role}\` is not a valid role.`);

        await this.client.settings.set(message.guild.id, role.id, 'djRole');
        return this.client.ui.reply(message, 'ok', `<@&${role.id}> has been set as the DJ Role.`);
    }
};
