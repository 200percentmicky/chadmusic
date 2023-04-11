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

const { Listener } = require('discord-akairo');

module.exports = class ListenerClientCommandStarted extends Listener {
    constructor () {
        super('clientCommandStarted', {
            emitter: 'commandHandler',
            event: 'commandStarted'
        });
    }

    async exec (message, command, args) {
        if (!await this.client.depWarnMsg.get(message.guild.id)) {
            this.client.ui.reply(message, 'warn', 'Message based commands are deprecated. Please use slash commands instead.');
            return this.client.depWarnMsg.set(message.guild.id, true, 1000 * 60 * 60 * 12);
        }
        this.client.settings.ensure(message.guild.id, this.client.defaultSettings);
    }
};
