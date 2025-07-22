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

module.exports = class CommandPlaylistShow extends Command {
    constructor () {
        super('playlist-show', {
            aliases: ['playlist-show', 'plshow'],
            description: {
                text: 'Lists all playlists in the server.'
            },
            category: '📜 Playlists'
        });
    }

    async exec (message, args) {
        if (!this.client.utils.isDJ(message.channel, message.member)) {
            return this.client.ui.sendPrompt(message, 'NO_DJ');
        }

        await this.client.playlists.ensure(message.guild.id, {});

        const playlists = this.client.playlists.get(message.guild.id);
        const playlistMap = [];

        for (const [k, v] of Object.entries(playlists)) {
            playlistMap.push({
                name: `${k}`,
                value: `${v.tracks?.length ?? 0} track${v.tracks?.length === 1 ? '' : 's'} - <@!${v.user}> (<t:${v.date_created}:f>)`
            });
        }

        if (!playlistMap) {
            return this.client.ui.reply(message, 'warn', '');
        }

        const embed = new EmbedBuilder()
            .setColor(message.guild.members.me.displayColor !== 0 ? message.guild.members.me.displayColor : null)
            .setAuthor({
                name: message.guild.name,
                iconURL: message.guild.iconURL()
            })
            .setTitle(':page_with_curl: Playlists')
            .setDescription(`${playlistMap.length > 0 ? `${playlistMap.map(x => `* **${x.name}** - ${x.value}`).join('\n')}` : `${process.env.EMOJI_WARN} There are no playlists on this server. Run \`${process.env.PREFIX}playlist-new <name>\` to create one.`}`)
            .setFooter({
                text: `${Object.entries(playlists).length} playlist${Object.entries(playlists).length === 1 ? '' : 's'}`
            });

        return message.channel.send({ embeds: [embed] });
    }
};
