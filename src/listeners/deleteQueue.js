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

module.exports = class ListenerDeleteQueue extends Listener {
    constructor () {
        super('deleteQueue', {
            emitter: 'player',
            event: 'deleteQueue'
        });
    }

    async exec (queue) {
        await queue.textChannel.client.utils.setVcStatus(queue.voiceChannel, null);

        if (queue.hasStopped) {
            if (queue.leaveOnStop) {
                this.client.vc.leave(queue.textChannel.guild);
                return this.client.logger.debug(`Left the voice channel in Guild ID ${queue.textChannel.guild.id}. The player was stopped.`);
            }
        } else {
            if (queue.leaveOnFinish) {
                this.client.vc.leave(queue.textChannel.guild);
                return this.client.logger.debug(`Left the voice channel in Guild ID ${queue.textChannel.guild.id}. The queue has reached the end.`);
            }
        }
    }
};
