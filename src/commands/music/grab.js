/**
 *  ChadMusic - The Chad Music Bot
 *  Copyright (C) 2022  Micky D. | @200percentmicky | Micky-kun#3836
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

const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

module.exports = class CommandGrab extends Command {
    constructor () {
        super('grab', {
            aliases: ['grab', 'save'],
            category: '🎶 Music',
            description: {
                text: 'Saves this song to your DMs.'
            },
            channel: 'guild',
            clientPermissions: ['EMBED_LINKS']
        });
    }

    async exec (message) {
    // Grab will not be affected by DJ Mode.
        const queue = this.client.player.getQueue(message);
        const song = queue.songs[0];

        const textChannel = this.client.settings.get(message.guild.id, 'textChannel', null);
        if (textChannel) {
            if (textChannel !== message.channel.id) {
                return this.client.ui.send(message, 'WRONG_TEXT_CHANNEL_MUSIC', textChannel);
            }
        }

        try {
            const embed = new MessageEmbed()
                .setColor(message.guild.me.displayColor !== 0 ? message.guild.me.displayColor : null)
                .setAuthor({
                    name: 'Song saved!',
                    iconURL: 'https://media.discordapp.net/attachments/375453081631981568/673819399245004800/pOk2_2.png'
                })
                .setTitle(song.name)
                .setURL(song.url)
                .setThumbnail(song.thumbnail)
                .addField('Duration', `${song.formattedDuration}`)
                .setTimestamp();
            message.author.send({ embeds: [embed] });
            return message.react(process.env.REACTION_OK);
        } catch (err) {
            if (err.name === 'DiscordAPIError') this.client.ui.reply(message, 'error', 'Unable to save this song. You are currently not accepting Direct Messages.');
        }
    }
};
