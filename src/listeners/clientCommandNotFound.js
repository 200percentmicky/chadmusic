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

module.exports = class ListenerClientCommandNotFound extends Listener {
    constructor () {
        super('clientCommandNotFound', {
            emitter: 'commandHandler',
            event: 'messageInvalid'
        });
    }

    async exec (message) {
        try {
            const prefix = this.client.settings.get(message.guild.id, 'prefix') ?? process.env.PREFIX;
            if (message.content.startsWith(prefix)) {
                this.client.logger.warn(`[Client] Command "${message.content.replace(prefix, '')}" not found.`);
            }
        } catch (err) {
            this.client.logger.warn(`Ignoring exception...\n${err.stack}`);
        }
    }
};
