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
const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = class ListenerPlayerError extends Listener {
    constructor () {
        super('playerError', {
            emitter: 'player',
            event: 'error'
        });
    }

    async exec (error, queue, song) {
        const errsplit = error.message.split(/ +/g);

        const knownErrors = {
            result: 'No results found.',
            extract: 'Not a supported URL or the URL is invalid.',
            Unsupported: 'Not a supported URL or the URL is invalid.',
            '403:': 'URL returned HTTP 403 (Forbidden)',
            '404:': 'URL returned HTTP 404 (Not Found)',
            '410:': 'URL returned HTTP 410 (Gone)',
            '416:': 'URL returned HTTP 416 (Range Not Satisfiable)',
            '429:': 'URL returned HTTP 429 (Too Many Requests)',
            Cookie: 'Cookie header used in the request has expired.',
            format: 'Cannot find a format of the video to play. The owner of the video has disabled playback on other websites, or the video is unavailable.',
            'Error [VOICE_CONNECTION_TIMEOUT]': 'The connection was not established within 15 seconds.'
        };

        let formattedError;
        const embed = new EmbedBuilder()
            .setColor(process.env.COLOR_ERROR)
            .setTitle(`${process.env.EMOJI_ERROR} Player Error`);

        const linkPerms = queue.textChannel.permissionsFor(this.client.user.id).has(PermissionsBitField.Flags.EmbedLinks);

        // Iterates through the split error message. If it finds a match, it will
        // return an easier to understand message. Otherwise, return a more detailed
        // error message.
        for (let i = 0; i < errsplit.length; i++) {
            if (knownErrors[errsplit[i]]) {
                formattedError = knownErrors[errsplit[i]];
                break;
            }
        }

        embed.setDescription(`${formattedError ? `${formattedError}\n` : ''}${error}`);
        embed.addFields([
            {
                name: 'Track',
                value: `**[${song.name}](${song.url})**`
            }
        ]);

        queue.textChannel.send(linkPerms
            ? { embeds: [embed] }
            : { content: `${process.env.EMOJI_ERROR} **Player Error**\n**[${song.name}](${song.url})**\n${formattedError}\n${error}` }
        );
    }
};
