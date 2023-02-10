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
const AutoComplete = require('youtube-autocomplete');
const { hasURL } = require('../../modules/hasURL');
const { handleCommand } = require('../../modules/handleCommand');

class CommandPlay extends SlashCommand {
    constructor (creator) {
        super(creator, {
            name: 'play',
            description: 'Plays a song by URL, an attachment, or from a search result.',
            options: [
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'track',
                    description: 'Plays a song by a search term or URL.',
                    options: [{
                        type: CommandOptionType.STRING,
                        name: 'query',
                        description: 'The track to play.',
                        required: true,
                        autocomplete: true
                    }]
                },
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'attachment',
                    description: 'Plays a song from an attachment.',
                    options: [{
                        type: CommandOptionType.ATTACHMENT,
                        name: 'file',
                        description: 'The file to play. Supports both audio and video files.',
                        required: true
                    }]
                },
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'now',
                    description: 'Force play a song regardless if anything is playing or not.',
                    options: [{
                        type: CommandOptionType.STRING,
                        name: 'query',
                        description: 'The track to play.',
                        required: true,
                        autocomplete: true
                    }]
                },
                {
                    type: CommandOptionType.SUB_COMMAND_GROUP,
                    name: 'radio',
                    description: 'Plays a live radio station.',
                    options: [
                        {
                            type: CommandOptionType.SUB_COMMAND,
                            name: 'iheartradio',
                            description: 'Plays a radio station from iHeartRadio.',
                            options: [{
                                type: CommandOptionType.STRING,
                                name: 'station',
                                description: 'The station to play. The name of the station should match what you wanna play.',
                                required: true
                            }]
                        }
                    ]
                }
            ]
        });

        this.filePath = __filename;
    }

    async autocomplete (ctx) {
        const query = ctx.options[ctx.subcommands[0]][ctx.focused];
        if (hasURL(query)) return [];
        AutoComplete(query, (err, queries) => {
            if (err) {
                this.client.logger.error('Unable to gather autocomplete data: %s', err);
                return ctx.sendResults([]);
            }
            return ctx.sendResults(queries[1].map((x) => ({ name: x, value: x })));
        });
    }

    async run (ctx) {
        switch (ctx.subcommands[0]) {
        case 'track': {
            return handleCommand(this.client, ctx, 'play', {
                track: ctx.options.track.query
            });
        }

        case 'attachment': {
            return handleCommand(this.client, ctx, 'play', {
                track: ctx.options.attachment.file
            });
        }

        case 'now': {
            return handleCommand(this.client, ctx, 'playnow', {
                track: ctx.options.now.query
            });
        }

        case 'radio': {
            switch (ctx.subcommands[1]) {
            case 'iheartradio': {
                return handleCommand(this.client, ctx, 'iheartradio', {
                    station: ctx.options.radio.iheartradio.station
                });
            }
            }
        }
        }
    }
}

module.exports = CommandPlay;
