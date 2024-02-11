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

const { stripIndents } = require('common-tags');
const { Command } = require('discord-akairo');

module.exports = class CommandPlaylistView extends Command {
    constructor () {
        super('playlist-view', {
            aliases: ['playlist-view', 'plview'],
            description: {
                text: 'List all tracks in a playlist.',
                usage: '<name>',
                details: stripIndents`
                \`<name>\` The name of the playlist.
                `
            },
            category: '📜 Playlists',
            args: [
                {
                    id: 'name',
                    match: 'rest',
                    type: 'string'
                }
            ]
        });
    }

    async exec (message, args) {
        if (!this.client.utils.isDJ(message.channel, message.member)) {
            return this.client.ui.sendPrompt(message, 'NO_DJ');
        }

        await this.client.playlists.ensure(message.guild.id, {});

        if (!args.name) {
            return this.client.ui.usage(message, 'playlist-view <name>');
        }

        if (!this.client.playlists.has(message.guild.id, args.name)) {
            return this.client.ui.reply(message, 'warn', `Playlist \`${args.name}\` does not exist.`);
        }

        const playlist = this.client.playlists.get(message.guild.id, `${args.name}.tracks`);
        const trackList = playlist.map(x => `**${playlist.indexOf(x) + 1}:** [${x.title}](${x.url}) (<t:${x.date_added}:f>)`).join('\n\n');

        if (!trackList) {
            return this.client.ui.reply(message, 'warn', `Playlist \`${args.name}\` is empty.`);
        }

        await this.client.ui.custom(
            message,
            ':page_with_curl:',
            message.guild.members.me.displayColor !== 0 ? message.guild.members.me.displayColor : null,
            trackList === '' ? `${process.env.EMOJI_WARN} This playlist is empty.` : trackList,
            `${args.name}`,
            `${playlist.length} ${playlist.length === 1 ? 'track' : 'tracks'}`
        );
    }
};
