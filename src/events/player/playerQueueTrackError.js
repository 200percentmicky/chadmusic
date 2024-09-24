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
const { EmbedBuilder } = require('discord.js');

module.exports = class ListenerPlayerQueueTrackError extends Listener {
    constructor () {
        super('playerQueueTrackError', {
            emitter: 'playerEvents',
            event: GuildQueueEvent.PlayerError
        });
    }

    async exec (queue, error, track) {
        const message = track.message || track.ctx;

        // Cleaning up the error message. Some extractors output the
        // entire error stack in its message instead of a simple output.
        // So far, removing the stack and only cleaning unnecessary bits.
        const cleanError = error.message
            .split('\n')
            .filter(e => !e.startsWith('    at'))
            .filter(e => !e.startsWith('[Object] '))
            .filter(e => e !== '')
            .join();

        console.log(cleanError);

        // TODO: Add option to allow bot owner to change this number.
        if (queue.totalErrors > 5) {
            queue.node.stop();
            return this.client.ui.reply(message, 'error', 'Too many errors occured and the player has been stopped.');
        }

        const embed = new EmbedBuilder()
            .setColor(process.env.COLOR_ERROR)
            .setTitle(`${process.env.EMOJI_ERROR} Player Error`);

        embed.setDescription(`${cleanError}`);
        embed.addFields([
            {
                name: 'Track',
                value: `**[${track.title}](${track.url})**`
            }
        ]);

        queue.metadata?.textChannel.send({ embeds: [embed] });
    }
};
