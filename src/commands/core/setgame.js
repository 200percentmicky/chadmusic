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

module.exports = class CommandSetGame extends Command {
    constructor () {
        super('setgame', {
            aliases: ['setgame'],
            description: {
                text: "Sets the bot's playing status.",
                usage: '[type] <status>',
                details: '`[type]` The type of status to set.\n`<status>` The overall status for the bot to use.'
            },
            category: '💻 Core',
            ownerOnly: true
        });
    }

    async exec (message) {
        const args = message.content.split(/ +/g);

        const statusType = {
            watching: 'WATCHING',
            listening: 'LISTENING',
            streaming: 'STREAMING'
        };

        const setStatus = async (status, type) => {
            try {
                await this.client.user.setActivity(status, { type: type });
                return message.react('✅').catch(() => {});
            } catch (err) {
                message.reply({ content: `:x: Unable to set status: \`${err.message}\`` });
            }
        };

        if (statusType[args[1]]) {
            return setStatus(args.slice(2).join(' '), statusType[args[1]]);
        } else {
            return setStatus(args.slice(1).join(' '), 'PLAYING');
        }
    }
};
