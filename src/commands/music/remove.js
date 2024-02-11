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
const { PermissionsBitField } = require('discord.js');
const { isSameVoiceChannel } = require('../../modules/isSameVoiceChannel');

module.exports = class CommandRemove extends Command {
    constructor () {
        super('remove', {
            aliases: ['remove', 'removesong'],
            category: '🎶 Music',
            description: {
                text: 'Removes an entry or multiple entries from the queue.',
                usage: '<queue_entry/start> [end]',
                details: '`<queue_entry/starting>` The queue entry to remove from the queue, or the starting position.\n[end] The end position for removing multiple entries.\nEvery entry from the starting to end position will be removed from the queue.'
            },
            channel: 'guild',
            clientPermissions: PermissionsBitField.Flags.EmbedLinks,
            args: [
                {
                    id: 'start',
                    type: 'number'
                },
                {
                    id: 'end',
                    type: 'number'
                }
            ]
        });
    }

    async exec (message, args) {
        const djMode = this.client.settings.get(message.guild.id, 'djMode');
        const djRole = this.client.settings.get(message.guild.id, 'djRole');
        const dj = message.member.roles.cache.has(djRole) || message.channel.permissionsFor(message.member.user.id).has(PermissionsBitField.Flags.ManageChannels);
        if (djMode) {
            if (!dj) return this.client.ui.sendPrompt(message, 'DJ_MODE');
        }

        const textChannel = this.client.settings.get(message.guild.id, 'textChannel', null);
        if (textChannel) {
            if (textChannel !== message.channel.id) {
                return this.client.ui.sendPrompt(message, 'WRONG_TEXT_CHANNEL_MUSIC', textChannel);
            }
        }

        const vc = message.member.voice.channel;
        if (!vc) return this.client.ui.sendPrompt(message, 'NOT_IN_VC');

        const currentVc = this.client.vc.get(vc);
        if (!this.client.player.getQueue(message) || !currentVc) return this.client.ui.sendPrompt(message, 'NOT_PLAYING');
        else if (!isSameVoiceChannel(this.client, message.member, vc)) return this.client.ui.sendPrompt(message, 'ALREADY_SUMMONED_ELSEWHERE');

        if (!args.start) return this.client.ui.usage(message, 'remove <queue_entry/starting> [end]');

        if (vc.members.size <= 2 || dj) {
            const queue = this.client.player.getQueue(message);

            /* Remove multiple entries from the queue. */
            if (args.end) {
                /* Parsing arguments as numbers */
                const start = parseInt(args.start);
                const end = parseInt(args.end);

                /* Checking if the arguments are numbers. */
                if (isNaN(start)) return this.client.ui.reply(message, 'error', 'Starting position must be a number.');
                if (isNaN(end)) return this.client.ui.reply(message, 'error', 'Ending position must be a number.');

                /* Slice original array to get the length. */
                const n = parseInt(queue.songs.slice(start, end).length + 1);

                /* Modify queue to remove the entries. */
                queue.songs.splice(start, n);

                return this.client.ui.reply(message, 'ok', `Removed **${n}** entries from the queue.`);
            } else {
                /* Removing only one entry from the queue. */
                const song = queue.songs[args.start];

                /* Checking if argument is a number. */
                const n = parseInt(args.start);
                if (isNaN(n)) return this.client.ui.reply(message, 'error', 'Selection must be a number.');

                /* Modify queue to remove the specified entry. */
                queue.songs.splice(args.start, 1);

                return this.client.ui.reply(message, 'ok', `Removed **${song.name}** from the queue.`);
            }
        } else {
            return this.client.ui.sendPrompt(message, 'NOT_ALONE');
        }
    }
};
