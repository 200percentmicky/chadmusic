/// ChadMusic - The Chad Music Bot
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

module.exports = class CommandVotePercentage extends Command {
    constructor () {
        super('votepercentage', {
            aliases: ['votepercentage'],
            category: '⚙ Settings',
            description: {
                text: 'Changes the vote-skip percentage requirement for placing votes to skip a track.',
                usage: '<percentage:0-100>',
                details: '`<percentage:0-100>` The percentage to set. Set to 0 to disable, or 100 to require everyone to vote. Default is 50.'
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
        if (!args.percentage) return this.client.ui.usage(message, 'votepercentage <percentage:0-100>');

        if (isNaN(args.percentage)) {
            return this.client.ui.reply(message, 'error', 'Percentage must be a number.');
        }

        if (args.percentage > 100 || args.percentage < 0) {
            return this.client.ui.reply(message, 'error', 'Percentage must be between 0 to 100.');
        }

        try {
            const newPercentage = parseFloat(args.percentage) / 100;
            await this.client.settings.set(message.guild.id, newPercentage, 'votingPercent');

            return this.client.ui.reply(message, 'ok', `Vote-skip percentage is set to **${args.percentage}%**.`);
        } catch (err) {
            return this.client.ui.reply(message, 'error', `Cannot set vote-skip percentage. ${err}`);
        }
    }
};
