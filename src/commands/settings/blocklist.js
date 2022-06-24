/**
 *  Micky-bot
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

const { Command } = require('discord-akairo');

module.exports = class CommandBlocklist extends Command {
    constructor () {
        super('blocklist', {
            aliases: ['blocklist'],
            category: '⚙ Settings',
            description: {
                text: 'Manages the server\'s list of blocked search phrases.',
                usage: '<add/remove> <phrase>',
                details: '`<add/remove>` Subcommands to whether add or remove phrases from the list.\n`<phrase>` The phrase to add or remove from the list.'
            },
            clientPermissions: ['EMBED_LINKS'],
            userPermissions: ['MANAGE_GUILD'],
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
            if (!args.phrase) return this.client.ui.usage(message, 'blocklist <add/remove> <phrase>');
            if (this.client.settings.includes(message.guild.id, args.phrase, 'blockedPhrases')) {
                return this.client.ui.reply(message, 'warn', `\`${args.phrase}\` doesn't exist in the blocklist.`);
            }

            await this.client.settings.push(message.guild.id, args.phrase, 'blockedPhrases');
            this.client.ui.reply(message, 'ok', `\`${args.phrase}\` has been added to the blocklist for this server.`, null, 'Any phrases in the blocklist will no longer be added to the queue.');
            break;
        }

        case 'remove': {
            if (!args.phrase) return this.client.ui.usage(message, 'blocklist <add/remove> <phrase>');
            if (!this.client.settings.includes(message.guild.id, args.phrase, 'blockedPhrases')) {
                return this.client.ui.reply(message, 'warn', `\`${args.phrase}\` doesn't exist in the blocklist.`);
            }

            await this.client.settings.remove(message.guild.id, args.phrase, 'blockedPhrases');
            this.client.ui.reply(message, 'ok', `\`${args.phrase}\` has been removed from the blocklist for this server.`);
            break;
        }

        default: {
            this.client.ui.usage(message, 'blocklist <add/remove> <phrase>');
        }
        }
    }
};
