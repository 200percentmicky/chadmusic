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
const { PermissionsBitField } = require('discord.js');

module.exports = class CommandBindChannel extends Command {
    constructor () {
        super('changechannel', {
            aliases: ['bindchannel', 'bindto', 'bc'],
            category: '🎶 Music',
            description: {
                text: 'Changes the player\'s currently binded text or voice channel to a different one.'
            },
            channel: 'guild',
            clientPermissions: PermissionsBitField.Flags.EmbedLinks,
            args: [
                {
                    type: 'channel',
                    id: 'channel'
                }
            ]
        });
    }

    async exec (message, args) {
        const djMode = this.client.settings.get(message.guild.id, 'djMode');
        const djRole = this.client.settings.get(message.guild.id, 'djRole');
        const dj = message.member.roles.cache.has(djRole) || message.channel.permissionsFor(message.member.user.id).has(PermissionsBitField.Flags.ManageChannels);
        if (djMode) {
            if (!dj) return this.client.ui.send(message, 'DJ_MODE');
        }

        if (!dj) return this.client.ui.send(message, 'NO_DJ');

        const vc = message.member.voice.channel;
        if (!vc) return this.client.ui.send(message, 'NOT_IN_VC');

        const currentVc = this.client.vc.get(vc);

        if (!this.client.player.getQueue(message) || !currentVc) return this.client.ui.send(message, 'NOT_PLAYING');

        const queue = this.client.player.getQueue(message.guild);

        try {
            const channel = await message.guild.channels.fetch(args.channel.id ?? message.channel.id);
            queue.textChannel = channel;
        } catch {
            // Should return an API error is the channel is invalid.
            return this.client.ui.reply(message, 'error', `\`${args.channel}\` is not a valid text channel.`);
        }

        return this.client.ui.reply(message, 'ok', `Got it. Now binded to ${args.channel ?? `<#${message.channel.id}>`}`);
    }
};
