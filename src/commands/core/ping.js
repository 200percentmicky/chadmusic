/**
 *  ChadMusic - The Chad Music Bot
 *  Copyright (C) 2023  Micky D. | @200percentmicky | Micky-kun#3836
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

const { stripIndents } = require('common-tags');
const { Command } = require('discord-akairo');

module.exports = class PingCommand extends Command {
    constructor () {
        super('ping', {
            aliases: ['ping'],
            description: {
                text: 'Shows the bot\'s latency to Discord.'
            },
            category: '💻 Core'
        });
    }

    async exec (message) {
        const ping = await message.reply(process.env.EMOJI_LOADING + 'Ping?');

        const timeDiff = (ping.editedAt || ping.createdAt) - (message.editedAt || message.createdAt);

        await ping.edit(stripIndents`
            ${process.env.EMOJI_OK} **Pong!**
            :heartbeat: \`${Math.round(this.client.ws.ping)}ms.\`
            :arrows_counterclockwise: \`${timeDiff}ms.\``
        );
    }
};
