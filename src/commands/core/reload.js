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

const { Command } = require('discord-akairo');
const { CommandContext } = require('slash-create');

/* eslint-disable padded-blocks */
/* eslint-disable no-multi-spaces */

module.exports = class CommandReload extends Command {
    constructor () {
        super('reload', {
            aliases: ['reload'],
            category: '💻 Core',
            description: {
                text: 'Reloads commands.',
                usage: '[reload_slash]',
                details: '`[reload_slash]` Whether to reload the application\'s slash commands.'
            },
            args: [
                {
                    id: 'reload_slash',
                    match: 'text',
                    default: true
                }
            ],
            ownerOnly: true
        });
    }

    async exec (message, args) {
        let resultEmoji = '✅';

        // Akairo Modules
        try {
            if (message instanceof CommandContext) {} // eslint-disable-line no-empty, brace-style
            else message.channel.sendTyping();

            // Everything must be unloaded before we can move on.
            await this.client.commands.removeAll();   // Commands
            await this.client.listeners.removeAll();  // Listeners

            // Now we can load everything.
            await this.client.commands.loadAll();
            await this.client.listeners.loadAll();
        } catch (err) {
            message.reply({ content: `:x: Error reloading modules: \`${err.message}\`` });
            resultEmoji = '❌';
        }

        // Application Commands
        // Now to resync all slash commands and reload them, if one chooses to.

        if (args.reloadslash) {
            try {
                await this.client.creator.syncCommands({
                    deleteCommands: process.env.DELETE_INVALID_COMMANDS === 'true' || false,
                    skipGuildErrors: true,
                    syncGuilds: true,
                    syncPermissions: true
                });
            } catch (err) {
                message.reply({ content: `:x: Error syncing slash commands: \`${err.message}\`\n` });
                resultEmoji = '❌';
            }

            await this.client.creator.commands.forEach(cmd => {
                try {
                    cmd.reload();
                } catch (err) {
                    message.reply({ content: `:x: Error reloading slash command \`${cmd.commandName}\`: \`${err.message}\`\n` });
                    resultEmoji = '❌';
                }
            });
        }

        return message.react(resultEmoji).catch(() => {});
    }
};
