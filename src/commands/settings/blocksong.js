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

const { Command } = require('discord-akairo');
const { PermissionsBitField } = require('discord.js');

module.exports = class CommandBlocksong extends Command {
    constructor () {
        super('blocksong', {
            aliases: ['blocksong'],
            category: '⚙ Settings',
            description: {
                text: 'Manages the server\'s list of blocked search phrases.',
                usage: '<add/remove> <phrase>',
                details: '`<add/remove>` Subcommands to whether add or remove phrases from the list.\n`<phrase>` The phrase to add or remove from the list.'
            },
            clientPermissions: [PermissionsBitField.Flags.EmbedLinks],
            userPermissions: [PermissionsBitField.Flags.ManageGuild],
            args: [
                {
                    id: 'subcommand',
                    type: 'string'
                },
                {
                    id: 'phrase',
                    match: 'rest'
                }
            ]
        });
    }

    async exec (message, args) {
        switch (args.subcommand) {
        case 'add': {
            if (!args.phrase) return this.client.ui.usage(message, 'blocksong <add/remove> <phrase>');
            if (this.client.settings.includes(message.guild.id, args.phrase, 'blockedPhrases')) {
                return this.client.ui.reply(message, 'warn', `\`${args.phrase}\` doesn't exist in the list.`);
            }

            await this.client.settings.push(message.guild.id, args.phrase, 'blockedPhrases');
            this.client.ui.reply(message, 'ok', `\`${args.phrase}\` is now blocked on this server.`, null, 'Any phrases in the list will no longer be added to the player.');
            break;
        }

        case 'remove': {
            if (!args.phrase) return this.client.ui.usage(message, 'blocksong <add/remove> <phrase>');
            if (!this.client.settings.includes(message.guild.id, args.phrase, 'blockedPhrases')) {
                return this.client.ui.reply(message, 'warn', `\`${args.phrase}\` doesn't exist in the list.`);
            }

            await this.client.settings.remove(message.guild.id, args.phrase, 'blockedPhrases');
            this.client.ui.reply(message, 'ok', `\`${args.phrase}\` is no longer blocked on this server.`);
            break;
        }

        default: {
            this.client.ui.usage(message, 'blocksong <add/remove> <phrase>');
        }
        }
    }
};
