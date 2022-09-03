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

const { SlashCommand } = require('slash-create');
const { EmbedBuilder } = require('discord.js');

class CommandGrab extends SlashCommand {
    constructor (creator) {
        super(creator, {
            name: 'grab',
            description: 'Sends the currently playing song as a direct message.'
        });

        this.filePath = __filename;
    }

    async run (ctx) {
        const client = this.creator.client;
        const guild = client.guilds.cache.get(ctx.guildID);
        const channel = await guild.channels.fetch(ctx.channelID);
        const _member = await guild.members.fetch(ctx.member.id);

        const vc = _member.voice.channel;
        if (!vc) return this.client.ui.send(ctx, 'NOT_IN_VC');

        const currentVc = this.client.vc.get(vc);

        if (!this.client.player.getQueue(guild) || !currentVc) return this.client.ui.send(ctx, 'NOT_PLAYING');

        const queue = this.client.player.getQueue(guild);
        const song = queue.songs[0];

        const textChannel = this.client.settings.get(guild.id, 'textChannel', null);
        if (textChannel) {
            if (textChannel !== channel.id) {
                return this.client.ui.send(ctx, 'WRONG_TEXT_CHANNEL_MUSIC', textChannel);
            }
        }

        await ctx.defer(true);

        const embed = new EmbedBuilder()
            .setColor(guild.members.me.displayColor !== 0 ? guild.members.me.displayColor : null)
            .setAuthor({
                name: 'Song saved!',
                iconURL: 'https://media.discordapp.net/attachments/375453081631981568/673819399245004800/pOk2_2.png'
            })
            .setTitle(song.name)
            .setURL(song.url)
            .setThumbnail(song.thumbnail)
            .addFields({
                name: 'Duration',
                value: `${song.formattedDuration}`
            })
            .setTimestamp();

        try {
            await _member.user.send({ embeds: [embed] });
            return this.client.ui.ctx(ctx, 'ok', 'Saved! Check your DMs. 📩');
        } catch {
            return this.client.ui.ctx(ctx, 'error', 'Cannot save this song because you\'re currently not accepting Direct Messages.');
        }
    }
}

module.exports = CommandGrab;
