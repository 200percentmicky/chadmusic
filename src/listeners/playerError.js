/**
 *  ChadMusic - The Chad Music Bot
 *  Copyright (C) 2023  Micky D. | @200percentmicky | Micky-kun#3836
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

const { Listener } = require('discord-akairo');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = class ListenerPlayerError extends Listener {
    constructor () {
        super('playerError', {
            emitter: 'player',
            event: 'error'
        });
    }

    async exec (channel, error) {
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

        let formattedError = 'An unknown error occured.';
        const embed = new EmbedBuilder()
            .setColor(parseInt(process.env.COLOR_ERROR))
            .setTitle(`${process.env.EMOJI_ERROR} Player Error`);

        const linkPerms = channel.permissionsFor(this.client.user.id).has(PermissionsBitField.Flags.EmbedLinks);

        // Iterates through the split error message. If it finds a match, it will
        // return an easier to understand message. Otherwise, return a more detailed
        // error message.
        for (let i = 0; i < errsplit.length; i++) {
            if (knownErrors[errsplit[i]]) {
                formattedError = knownErrors[errsplit[i]];
                break;
            }
        }

        embed.setDescription(`${formattedError}\n\`\`\`js\n${error.name}: ${error.message}\`\`\``);

        channel.send(linkPerms
            ? { embeds: [embed] }
            : { content: `${process.env.EMOJI_ERROR} **Player Error**\n${formattedError}\`\`\`js\n${error.name}: ${error.message}\`\`\`` }
        );

    /*
    if (errsplit.includes('extract') || errsplit.includes('Unsupported')) return this.client.ui.reply(message, 'error', 'Not a supported URL or the URL is invalid.', 'Player Error')
    if (errsplit.includes('403')) return this.client.ui.reply(message, 'error', 'URL returned HTTP 403 (Forbidden)')
    if (errsplit.includes('416')) return this.client.ui.reply(message, 'error', 'Received `Status code: 416 [Range Not Satisfiable]`. This is a weird response. Please try again.', 'Player Error')
    if (errsplit.includes('Cookie')) return this.client.ui.reply(message, 'error', 'Cookie header used in the request has expired. The bot owner has been notified about this.', 'Player Error')
    if (errsplit.includes('format')) return this.client.ui.reply(message, 'error', 'Cannot find a format of the video to play. The owner of the video has disabled playback on other websites, or the video is unavailable.', 'Player Error')
    if (error.name.includes('Error [VOICE_CONNECTION_TIMEOUT]')) return this.client.ui.reply(message, 'error', 'The connection was not established within 15 seconds. Please try again later.', 'Voice Connection Timeout')
    */
    }
};
