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

const { Listener } = require('discord-akairo');

module.exports = class CommandBlockedListener extends Listener {
    constructor () {
        super('commandBlocked', {
            emitter: 'commandHandler',
            event: 'commandBlocked'
        });
    }

    async exec (message, command, reason) {
        if (reason === 'owner') return this.client.ui.reply(message, 'no', 'That command can only be used by the bot owner.');
        if (reason === 'guild') return this.client.ui.reply(message, 'error', 'That command must be used in a server.');
        if (reason === 'dm') return this.client.ui.reply(message, 'error', 'That command must be used in a Direct Message.');
    }
};
