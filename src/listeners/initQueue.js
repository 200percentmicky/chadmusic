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

module.exports = class ListenerInitQueue extends Listener {
    constructor () {
        super('initQueue', {
            emitter: 'player',
            event: 'initQueue'
        });
    }

    async exec (queue) {
        const guild = queue.textChannel.guild;
        const settings = this.client.settings.get(guild.id);

        queue.autoplay = false;
        queue.volume = parseInt(settings.defaultVolume);
        queue.leaveOnStop = settings.leaveOnStop;
        queue.leaveOnFinish = settings.leaveOnFinish;
        queue.leaveOnEmpty = settings.leaveOnEmpty;
        queue.emptyCooldown = parseInt(settings.emptyCooldown);
        queue.votes = []; // Initialize an empty array for casting votes.
        queue.formattedFilters = []; // Used to format the active filters in the queue, if any.
        queue.peeStoredInBalls = true; // lol
    }
};
