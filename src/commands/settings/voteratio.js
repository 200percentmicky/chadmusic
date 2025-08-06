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

module.exports = class CommandVoteRatio extends Command {
    constructor () {
        super('voteratio', {
            aliases: ['voteratio', 'votepercentage'],
            category: '⚙ Settings',
            description: {
                text: 'Changes the vote-skip ratio requirement for placing votes to skip a track.',
                usage: '<percentage:0-100>',
                details: '`<percentage:0-100>` The ratio to set as a percentage. Set to 0 to disable, or 100 to require everyone to vote.'
            },
            userPermissions: [PermissionsBitField.Flags.ManageGuild],
            args: [
                {
                    id: 'percentage',
                    match: 'text'
                }
            ]
        });
    }

    async exec (message, args) {
        if (!args.percentage) return this.client.ui.usage(message, 'voteratio <percentage:0-100>');

        if (isNaN(args.percentage)) {
            return this.client.ui.reply(message, 'error', 'Percentage ratio must be a number.');
        }

        if (args.percentage > 100 || args.percentage < 0) {
            return this.client.ui.reply(message, 'error', 'Percentage ratio must be between 0 to 100.');
        }

        try {
            const newPercentage = parseFloat(args.percentage) / 100;
            await this.client.settings.set(message.guild.id, newPercentage, 'votingPercent');

            return this.client.ui.reply(message, 'ok', `Vote-skip ratio is set to **${args.percentage}%**.`);
        } catch (err) {
            return this.client.ui.reply(message, 'error', `Unable to change vote-skip ratio. ${err}`);
        }
    }
};
