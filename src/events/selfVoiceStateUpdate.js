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
const { Events } = require('discord.js');

module.exports = class ListenerSelfVoiceStateUpdate extends Listener {
    constructor () {
        super('selfVoiceStateUpdate', {
            emitter: 'client',
            event: Events.VoiceStateUpdate
        });
    }

    async exec (oldState, newState) {
        if (newState.member.user === this.client.user) {
            const queue = this.client.player.getQueue(newState.guild);
            if (queue) {
                try {
                    const song = queue.songs[0];
                    const status = `${process.env.EMOJI_MUSIC} ${song.name} [${song.formattedDuration}] (${song.user.displayName} - ${song.user.username})`;

                    this.client.utils.setVcStatus(
                        newState.member.voice.channel,
                        status.length > 500 ? status.substring(0, 496) + '...' : status,
                        `Moved to voice channel ${newState.channel.name}`
                    );
                } catch (err) {
                    this.client.logger.debug(`[${newState.channelId}] Tried setting a VC status but failed. ${err}`);
                }
            }
        }
    }
};
