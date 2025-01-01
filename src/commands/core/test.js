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

module.exports = class CommandTest extends Command {
    constructor () {
        super('test', {
            aliases: ['test'],
            description: {
                text: 'Just a normal test command. Also pay no heed.'
            },
            category: '💻 Core',
            args: [
                {
                    id: 'error',
                    match: 'rest'
                }
            ]
        });
    }

    async exec (message, args) {
        if (args.error === 'error') {
            const e = new Error('I did an oopsie.');
            e.name = 'GuruMeditationTest';
            throw e;
        } else {
            return this.client.util.reply(message, 'info', 'lol');
        }
    }
};
