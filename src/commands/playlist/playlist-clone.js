/// ChadMusic - The Chad Music Bot
/// Copyright (C) 2023  Micky D. | @200percentmicky | Micky-kun#3836
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

module.exports = class CommandPlaylistClone extends Command {
    constructor () {
        super('playlist-clone', {
            aliases: ['playlist-clone', 'plclone'],
            description: {
                text: 'Creates a playlist by cloning an existing one.',
                usage: '<"name"> ["clone_name"]',
                details: stripIndents`
                \`<"name">\` The name of the playlist. Use quotations if the name contains spaces.
                \`["clone_name"]\` The name to give to the cloned playlist. If nothing, affixes "- Copy" to the original name.
                `
            },
            category: '📜 Playlists',
            args: [
                {
                    id: 'name',
                    match: 'phrase',
                    type: 'string'
                },
                {
                    id: 'clone_name',
                    match: 'phrase',
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
            return this.client.ui.usage(message, 'playlistclone <"name"> ["clone_name"]');
        }

        try {
            if (!this.client.playlists.has(message.guild.id, args.name)) {
                return this.client.ui.reply(message, 'warn', `Playlist \`${args.name}\` does not exists.`);
            } else {
                const original = this.client.playlists.get(message.guild.id, args.name);
                await this.client.playlists.set(message.guild.id, original, args.clone ?? `${args.name} - Copy`);
            }
            return this.client.ui.reply(message, 'ok', `Cloned playlist \`${args.name}\` into new playlist \`${args.clone ?? `${args.name} - Copy`}\`.`);
        } catch (err) {
            this.client.ui.reply(message, 'error', `Unable to clone the playlist \`${args.name}\`. ${err.message}`);
        }
    }
};
