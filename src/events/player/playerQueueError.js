/// ChadMusic - The Chad Music Bot
/// Copyright (C) 2024  Micky | 200percentmicky
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
const { GuildQueueEvent } = require('discord-player');

module.exports = class ListenerPlayerQueueError extends Listener {
    constructor () {
        super('playerQueueError', {
            emitter: 'playerEvents',
            event: GuildQueueEvent.Error
        });
    }

    async exec (queue, error) {
        this.client.logger.error(`Error playing track: ${error}`);
    }
};
