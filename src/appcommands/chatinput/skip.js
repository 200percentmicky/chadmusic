/**
 *  ChadMusic - The Chad Music Bot
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
const { handleCommand } = require('../../modules/handleCommand');

class CommandSkip extends SlashCommand {
    constructor (creator) {
        super(creator, {
            name: 'skip',
            description: 'Skips the playing track.',
            options: [
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'track',
                    description: 'Skips the playing track, or vote to skip if the voice channel has more than 3 people.'
                },
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'force',
                    description: 'Force skips the currently playing track.'
                },
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'jump',
                    description: 'Skips the track to a specified entry in the queue.',
                    options: [
                        {
                            type: CommandOptionType.INTEGER,
                            name: 'index',
                            description: 'The entry in the queue to skip to.',
                            min_value: 1,
                            required: true
                        }
                    ]
                }
            ]
        });

        this.filePath = __filename;
    }

    async run (ctx) {
        switch (ctx.subcommands[0]) {
        case 'force': {
            return handleCommand(this.client, ctx, 'forceskip');
        }

        case 'jump': {
            return handleCommand(this.client, ctx, 'skipto', {
                index: ctx.options.jump.index
            });
        }

        default: { // track
            return handleCommand(this.client, ctx, 'skip');
        }
        }
    }
}

module.exports = CommandSkip;
