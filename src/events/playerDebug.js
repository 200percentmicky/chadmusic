/// ChadMusic
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

const { Listener } = require('discord-akairo');
const { Events } = require('distube');

module.exports = class ListenerPlayerDebug extends Listener {
    constructor () {
        super('playerDebug', {
            emitter: 'player',
            event: Events.DEBUG
        });
    }

    async exec (debug) {
        this.client.logger.debug(`[Client] [Player] ${debug}`);
    }
};
