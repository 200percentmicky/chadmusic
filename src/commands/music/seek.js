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
const { toMilliseconds } = require('colon-notation');
const { isSameVoiceChannel } = require('../../modules/isSameVoiceChannel');

module.exports = class CommandSeek extends Command {
    constructor () {
        super('seek', {
            aliases: ['seek'],
            description: {
                text: 'Sets the playing time of the track to a new position.',
                usage: '<time>',
                details: '`<time>` The time of the track to seek to in colon notation or in milliseconds.'
            },
            category: '🎶 Music'
        });
    }

    async exec (message) {
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

        const args = message.content.split(/ +/g);

        const vc = message.member.voice.channel;
        if (!vc) return this.client.ui.sendPrompt(message, 'NOT_IN_VC');

        const currentVc = this.client.vc.get(vc);
        const queue = this.client.player.getQueue(message);

        if (!queue || !currentVc) return this.client.ui.sendPrompt(message, 'NOT_PLAYING');
        else if (!isSameVoiceChannel(this.client, message.member, vc)) return this.client.ui.sendPrompt(message, 'ALREADY_SUMMONED_ELSEWHERE');

        if (queue.songs[0].isLive) return this.client.ui.reply(message, 'error', 'This command cannot be used during live broadcasts.');

        if (vc.members.size <= 2 || dj) {
            if (!args[1]) return this.client.ui.usage(message, 'seek <time>');
            try {
                const time = toMilliseconds(args[1]);
                this.client.player.seek(message.guild, parseInt(Math.floor(time / 1000)));
            } catch {
                this.client.ui.reply(message, 'error', 'Track time must be in colon notation or in milliseconds. Example: `4:30`');
            }
            return message.react(process.env.REACTION_OK).catch(() => {});
        } else {
            return this.client.ui.sendPrompt(message, 'NOT_ALONE');
        }
    }
};
