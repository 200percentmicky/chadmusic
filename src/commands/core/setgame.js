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
const { ActivityType } = require('discord.js');

module.exports = class CommandSetGame extends Command {
    constructor () {
        super('setgame', {
            aliases: ['setgame'],
            description: {
                text: "Changes the bot's playing status.",
                usage: '[type] <status>',
                details: '`[type]` The type of status to use.\n`<status>` The status for the bot to use.'
            },
            category: '💻 Core',
            ownerOnly: true,
            args: [
                {
                    id: 'type',
                    type: [
                        'competing',
                        'custom',
                        'listening',
                        'playing',
                        'watching'
                    ],
                    default: 'custom'
                },
                {
                    id: 'status',
                    match: 'restContent'
                }
            ]
        });
    }

    async exec (message, args) {
        const statusType = {
            competing: ActivityType.Competing,
            custom: ActivityType.Custom,
            listening: ActivityType.Listening,
            playing: ActivityType.Playing,
            watching: ActivityType.Watching
        };

        const setStatus = async (status, type, url) => {
            try {
                await this.client.user.setActivity(status, { type, url });
                return message.react('✅').catch(() => {});
            } catch (err) {
                message.reply({ content: `:x: Failed to set status: \`${err.message}\`` });
            }
        };

        return setStatus(args.type === 'custom' ? message.content.split(/ +/g).slice(1).join(' ') : args.status, statusType[args.type]);
    }
};
