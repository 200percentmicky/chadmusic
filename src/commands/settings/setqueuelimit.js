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
const { PermissionsBitField } = require('discord.js');

module.exports = class CommandSetQueueLimit extends Command {
    constructor () {
        super('setqueuelimit', {
            aliases: ['setqueuelimit'],
            category: '⚙ Settings',
            description: {
                text: 'Limits the number of entries that members can add to the queue.',
                usage: '<number>',
                details: '`<number>` The numbers of entries to limit for members.'
            },
            userPermissions: [PermissionsBitField.Flags.ManageGuild],
            args: [
                {
                    id: 'number',
                    match: 'rest'
                }
            ]
        });
    }

    async exec (message, args) {
        if (!args.number) return this.client.ui.usage(message, 'setqueuelimit <number>');

        if (args.number === (0 || 'NONE'.toLowerCase())) {
            await this.client.settings.delete(message.guild.id, 'maxQueueLimit');
            return this.client.ui.reply(message, 'ok', 'Queue Limits have been removed.');
        }

        if (isNaN(args.number)) return this.client.ui.reply(message, 'error', 'You must provide a number.');
        else if (args.number < 0) return this.client.ui.reply(message, 'error', 'You cannot use a negative value.');

        await this.client.settings.set(message.guild.id, parseInt(args.number), 'maxQueueLimit');
        return this.client.ui.reply(message, 'ok', `Queue Limits have been set to \`${args.number}\``);
    }
};
