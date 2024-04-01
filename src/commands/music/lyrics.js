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

const { Command } = require('discord-akairo');
const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const Genius = require('genius-lyrics');
const { CommandContext } = require('slash-create');

module.exports = class CommandLyrics extends Command {
    constructor () {
        super('lyrics', {
            aliases: ['lyrics'],
            category: '🎶 Music',
            description: {
                text: 'Retrieves lyrics from the playing track or from search query.',
                usage: 'lyrics [query]',
                details: '`[query]` The search query to find lyrics.'
            },
            channel: 'guild',
            args: [
                {
                    id: 'query',
                    match: 'rest'
                }
            ],
            cooldown: 10 * 1000
        });
    }

    async exec (message, args) {
        const djMode = this.client.settings.get(message.guild.id, 'djMode');
        const djRole = this.client.settings.get(message.guild.id, 'djRole');
        const dj = message.member.roles.cache.has(djRole) || message.channel.permissionsFor(message.member.user.id).has(PermissionsBitField.Flags.ManageChannels);
        if (djMode) {
            if (!dj) return this.client.ui.sendPrompt(message, 'DJ_MODE');
        }

        const geniusClient = new Genius.Client(process.env.GENIUS_TOKEN);
        const queue = this.client.player.getQueue(message.guild);
        const query = queue?.songs[0]?.name ?? args.query;

        if (!queue && !query) {
            return this.client.ui.reply(message, 'warn', 'Nothing is currently playing in this server. You can use `lyrics [query]` to manually search for lyrics.');
        }

        if (message instanceof CommandContext) {} // eslint-disable-line no-empty, brace-style
        else message.channel.sendTyping();

        try {
            const songSearch = await geniusClient.songs.search(query);
            const songLyrics = await songSearch[0].lyrics();

            if (songLyrics.length > 4096) {
                // Since Genius likes to give you weird results, it most likely didn't
                // retrieve lyrics causing the embed to exceed its limits.
                return this.client.ui.reply(message, 'error', 'Unable to retrieve lyrics from currently playing song. Try manually searching for the song using `lyrics [query]`.');
            }

            const embed = new EmbedBuilder()
                .setColor(message.guild.members.me.displayColor !== 0 ? message.guild.members.me.displayColor : null)
                .setAuthor({
                    name: songSearch[0].artist.name,
                    url: songSearch[0].artist.url,
                    iconURL: songSearch[0].artist.image
                })
                .setTitle(songSearch[0].title)
                .setURL(songSearch[0].url)
                .setDescription(`${songLyrics}`)
                .setThumbnail(songSearch[0].image)
                .setFooter({
                    text: `${message.member.user.tag.replace(/#0{1,1}$/, '')} • Powered by Genius API. (https://genius.com)`,
                    iconURL: message.member.user.avatarURL({ dynamic: true })
                });
            return message.reply({ embeds: [embed] });
        } catch (err) {
            return this.client.ui.reply(message, 'error', err.message, 'Genius API Error');
        }
    }
};
