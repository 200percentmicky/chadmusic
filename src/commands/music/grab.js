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

const { Command } = require('discord-akairo');
const { EmbedBuilder } = require('discord.js');
const { CommandContext } = require('slash-create');

module.exports = class CommandGrab extends Command {
    constructor () {
        super('grab', {
            aliases: ['grab', 'save'],
            category: '🎶 Music',
            description: {
                text: 'Saves this song to your DMs.'
            },
            channel: 'guild'
        });
    }

    async exec (message) {
        // Grab will not be affected by DJ Mode.
        const vc = message.member.voice.channel;
        if (!vc) return this.client.ui.sendPrompt(message, 'NOT_IN_VC');

        const currentVc = this.client.vc.get(vc);

        if (!this.client.player.getQueue(message) || !currentVc) return this.client.ui.sendPrompt(message, 'NOT_PLAYING');

        const queue = this.client.player.getQueue(message);
        const song = queue.songs[0];

        const textChannel = this.client.settings.get(message.guild.id, 'textChannel', null);
        if (textChannel) {
            if (textChannel !== message.channel.id) {
                return this.client.ui.sendPrompt(message, 'WRONG_TEXT_CHANNEL_MUSIC', textChannel);
            }
        }

        let songTitle = song.name;
        if (songTitle.length > 256) songTitle = song.name.substring(0, 252) + '...';

        const embed = new EmbedBuilder()
            .setColor(message.guild.members.me.displayColor !== 0 ? message.guild.members.me.displayColor : null)
            .setAuthor({
                name: 'Song saved!',
                iconURL: 'https://media.discordapp.net/attachments/375453081631981568/673819399245004800/pOk2_2.png'
            })
            .setTitle(`${songTitle}`)
            .setURL(song.url)
            .addFields({ name: 'Duration', value: `${song.formattedDuration}` })
            .setTimestamp();

        const thumbnailSize = await this.client.settings.get(message.guild.id, 'thumbnailSize');

        switch (thumbnailSize) {
        case 'small': {
            embed.setThumbnail(song.thumbnail);
            break;
        }
        case 'large': {
            embed.setImage(song.thumbnail);
            break;
        }
        }

        try {
            await message.member.user.send({ embeds: [embed] });
            if (message instanceof CommandContext) {
                await message.defer(true);
                return this.client.ui.reply(message, 'ok', 'Saved! Check your DMs. 📩');
            } else {
                return message.react(process.env.REACTION_OK).catch(() => {});
            }
        } catch {
            return this.client.ui.reply(message, 'error', 'Cannot save this song because you\'re currently not accepting Direct Messages.');
        }
    }
};
