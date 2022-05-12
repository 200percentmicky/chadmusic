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

const { Listener } = require('discord-akairo');

module.exports = class ListenerMentionPrefix extends Listener {
    constructor () {
        super('mentionPrefix', {
            emitter: 'client',
            event: 'messageCreate'
        });
    }

    async exec (message) {
        if (message.content === `<@${this.client.user.id}>`) {
            return message.channel.send(`${process.env.EMOJI_MUSIC} My prefix for music commands is \`${process.env.PREFIX}\`. You can also use the applications's Slash Commands, or use the bot's mention as a prefix.`);
        }
    }
};
