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
const { stripIndents } = require('common-tags');

module.exports = class CommandMove extends Command {
    constructor () {
        super('move', {
            aliases: ['move'],
            category: '🎶 Music',
            description: {
                text: 'Moves a track in the queue to a new position.',
                usage: '<track> [position]',
                details: stripIndents`
                \`<track>\` The track to move.
                \`[position]\` The new position in the queue. If omitted, moves the selection to the first position in the queue.
                `
            },
            channel: 'guild',
            clientPermissions: PermissionsBitField.Flags.EmbedLinks,
            args: [
                {
                    id: 'track',
                    type: 'number'
                },
                {
                    id: 'position',
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

        if (!args.track) return this.client.ui.usage(message, 'move <track> [position]');

        const queue = this.client.player.getQueue(message.guild);

        if (vc.members.size <= 2 || dj) {
            const track = parseInt(args.track);
            const position = parseInt(args.position || 1);

            if (track < 1 || track > queue.songs.length) {
                return this.client.ui.reply(message, 'error', `Track position must be between tracks 1 or ${queue.songs.length - 1}.`);
            }

            if (position < 1 || position > queue.songs.length) {
                return this.client.ui.reply(message, 'error', `New track position must be between tracks 1 or ${queue.songs.length - 1}.`);
            }

            if (isNaN(track)) return this.client.ui.reply(message, 'error', 'Starting position must be a number.');
            if (isNaN(position)) return this.client.ui.reply(message, 'error', 'New track position must be a number.');

            message.channel.sendTyping();

            const song = queue.songs[track];
            queue.songs.splice(track, 1);
            queue.songs.splice(position ?? 1, 0, song);

            return this.client.ui.reply(message, 'ok', `Moved **${song.name}** to position \`${position || 1}\`.`);
        } else {
            return this.client.ui.sendPrompt(message, 'NOT_ALONE');
        }
    }
};
