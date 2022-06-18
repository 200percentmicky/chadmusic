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
            userPermissions: ['MANAGE_GUILD']
        });
    }

    async exec (message) {
        const args = message.content.split(/ +/g);
        if (args[1]) {
            const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]);
            if (!channel) {
                return this.client.ui.reply(message, 'error', `\`${args[1]}\` is not a valid text channel.`);
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
