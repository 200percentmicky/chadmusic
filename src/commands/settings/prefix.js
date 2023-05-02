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

module.exports = class CommandMusicPrefix extends Command {
    constructor () {
        super('prefix', {
            aliases: ['prefix'],
            category: '⚙ Settings',
            description: {
                text: 'Changes the bot\'s prefix for this server.',
                usage: '<prefix>',
                details: `\`<prefix>\` The new prefix you want to use. If none, resets the prefix to defaults.\n${process.env.EMOJI_INFO} The default prefix defined in the .env file will always be available.`
            },
            clientPermissions: [PermissionsBitField.Flags.EmbedLinks],
            userPermissions: [PermissionsBitField.Flags.ManageGuild],
            args: [
                {
                    id: 'prefix',
                    type: 'string'
                }
            ]
        });
    }

    async exec (message, args) {
        const prefix = args.prefix;

        if (!prefix) {
            await this.client.settings.set(message.guild.id, process.env.PREFIX, 'prefix');
            return this.client.ui.reply(message, 'ok', `The prefix has been reset to \`${process.env.PREFIX}\``);
        }
        await this.client.settings.set(message.guild.id, prefix, 'prefix');
        return this.client.ui.reply(message, 'ok', `The prefix has been set to \`${prefix}\``);
    }
};
