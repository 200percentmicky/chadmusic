/// ChadMusic - The Chad Music Bot
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
const { Events } = require('discord.js');
const Enmap = require('enmap');

module.exports = class ListenerLeaveOnEmpty extends Listener {
    constructor () {
        super('leaveOnEmpty', {
            emitter: 'client',
            event: Events.VoiceStateUpdate
        });

        this.timeoutIds = new Enmap();
    }

    async exec (oldState, newState) {
        const activeTimeout = await this.timeoutIds.get(newState.guild.id);
        const clearTimeoutData = () => {
            if (!this.timeoutIds.has(newState.guild.id)) return;
            try {
                clearTimeout(activeTimeout);
            } catch {}
            this.client.logger.debug(`[${newState.guild.id}] Timeout data cleared.`);
            this.timeoutIds.delete(newState.guild.id);
        };

        const queue = await this.client.player.getQueue(newState.guild);
        if (!queue) {
            // If no queue, better to delete timeout data just in case...
            try {
                clearTimeoutData();
            } catch {
                return;
            }
        }

        if (newState.member.id === this.client.user.id) {
            // If it's the client leaving or even joining, clear timeout data.
            try {
                clearTimeoutData();
            } catch {
                return;
            }
        }

        if (queue && queue.leaveOnEmpty === true) {
            const emptyCooldown = queue.emptyCooldown;
            const clientVc = await newState.guild.channels.cache.get(queue.voice?.connection.joinConfig.channelId);

            console.log(clientVc.members.size);
            if (clientVc.members.size === 1) {
                const leaveOnEmptyTimeout = setTimeout(() => {
                    this.timeoutIds.delete(newState.guild.id);
                    return this.client.vc.leave(newState.guild);
                }, parseInt(emptyCooldown * 1000));
                this.timeoutIds.set(newState.guild.id, leaveOnEmptyTimeout[Symbol.toPrimitive]());
                this.client.logger.debug(`[${newState.guild.id}] Timeout set for ${emptyCooldown} seconds.`);
            } else {
                if (activeTimeout) {
                    clearTimeout(activeTimeout);
                }
                this.timeoutIds.delete(newState.guild.id);
                this.client.logger.debug(`[${newState.guild.id}] Timeout cleared or no timeout active.`);
            }
        }
    }
};
