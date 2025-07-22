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
const { PermissionsBitField } = require('discord.js');

module.exports = class CommandTextChannel extends Command {
    constructor () {
        super('textchannel', {
            aliases: ['textchannel'],
            category: '⚙ Settings',
            description: {
                text: 'Sets the text channel to use for music commands.',
                usage: '<text_channel>',
                details: "`<text_channel>` The text channel to apply. Can be the channel's mention or the channel's ID."
            },
            userPermissions: [PermissionsBitField.Flags.ManageGuild],
            args: [
                {
                    id: 'channel',
                    match: 'rest'
                }
            ]
        });
    }

    async exec (message, args) {
        if (args.channel) {
            const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args.channel);
            if (!channel) {
                return this.client.ui.reply(message, 'error', `\`${args.channel}\` is not a valid text channel.`);
            } else {
                await this.client.settings.set(message.guild.id, channel.id, 'textChannel');
                return this.client.ui.reply(message, 'ok', `<#${channel.id}> will be used for music commands.`);
            }
        } else {
            await this.client.settings.delete(message.guild.id, 'textChannel');
            return this.client.ui.reply(message, 'ok', 'All text channels will be used for music commands.');
        }
    }
};
