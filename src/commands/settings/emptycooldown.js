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

const { stripIndent } = require('common-tags');
const { Command } = require('discord-akairo');
const { PermissionsBitField } = require('discord.js');

module.exports = class CommandEmptyCooldown extends Command {
    constructor () {
        super('emptycooldown', {
            aliases: ['emptycooldown'],
            category: '⚙ Settings',
            description: {
                text: 'Sets how long the bots stays in an empty voice channel.',
                usage: '<time>',
                details: stripIndent`
                \`<time>\` The time the bot will stay in seconds.
                :information_source: This settings only works if **Leave on Empty** is on.
                `
            },
            userPermissions: [PermissionsBitField.Flags.ManageGuild],
            args: [
                {
                    id: 'time',
                    type: 'number',
                    match: 'text'
                }
            ]
        });
    }

    async exec (message, args) {
        if (!args.time) return this.client.ui.usage(message, 'emptycooldown <time>');

        if (isNaN(args.time)) return this.client.ui.reply(message, 'error', 'The value must be a number.');

        const queue = await this.client.player.getQueue(message.guild);

        await this.client.settings.set(message.guild.id, parseInt(args.time), 'emptyCooldown');
        if (queue) queue.emptyCooldown = parseInt(args.time);
        return this.client.ui.reply(message, 'ok', `Empty Cooldown has been set to \`${parseInt(args.time)}\` seconds.`);
    }
};
