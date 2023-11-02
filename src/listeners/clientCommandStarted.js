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

const { Listener } = require('discord-akairo');
const Keyv = require('keyv');

module.exports = class ListenerClientCommandStarted extends Listener {
    constructor () {
        super('clientCommandStarted', {
            emitter: 'commandHandler',
            event: 'commandStarted'
        });

        this.prefixDepWarning = new Keyv();
    }

    async exec (message, command, args) {
        this.client.settings.ensure(message.guild.id, this.client.defaultSettings);

        if (!await this.prefixDepWarning.get(message.guild.id)) {
            this.client.ui.reply(message, 'warn', 'Classic prefix commands have been deprecated. Please use slash commands instead.');
            await this.prefixDepWarning.set(message.guild.id, true, 12 * 60 * 60 * 1000);
        } else {} // eslint-disable-line no-empty, brace-style
    }
};
