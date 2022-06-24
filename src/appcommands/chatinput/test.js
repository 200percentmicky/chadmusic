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

const { SlashCommand, CommandOptionType } = require('slash-create');

class CommandTest extends SlashCommand {
    constructor (creator) {
        super(creator, {
            name: 'test',
            description: 'Test command. Pay no heed.',
            options: [
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'normal',
                    description: 'Just a normal test command. Also pay no heed.'
                },
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'error',
                    description: 'bruh moment'
                }
            ]
        });

        this.filePath = __filename;
    }

    async run (ctx) {
        switch (ctx.subcommands[0]) {
        case 'normal': {
            return this.client.ui.ctx(ctx, 'ok', 'Yay! I\'m working as I should! What was I suppose to do again? 😗');
        }

        case 'error': {
            const e = new Error('Successfully threw an error. How did I do? :3');
            e.name = 'GuruMeditationTest';
            throw e;
        }
        }
    }
}

module.exports = CommandTest;
