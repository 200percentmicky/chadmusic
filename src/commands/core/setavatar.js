/// ChadMusic - The Chad Music Bot
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

module.exports = class CommandSetAvatar extends Command {
    constructor () {
        super('setavatar', {
            aliases: ['setavatar'],
            description: {
                text: "Changes the bot's avatar. If no arguments are provided, removes the avatar.",
                usage: '[image]',
                details: '`[image]` The attached image or the URL of an image to use for the avatar. Supports GIF, JPEG, or PNG formats.'
            },
            category: '💻 Core',
            ownerOnly: true,
            args: [
                {
                    id: 'attachment',
                    type: 'text'
                }
            ]
        });
    }

    async exec (message, args) {
        const imageUrl = args.image ?? message.attachments?.first()?.url;

        try {
            imageUrl.match(/(gif|jpg|png)/g);
        } catch {
            return this.client.ui.reply(message, 'error', 'Supported image formats are GIF, JPEG, or PNG.');
        }

        try {
            await this.client.user.setAvatar(imageUrl ?? null);
            return message.react('✅');
        } catch (err) {
            return message.reply({ content: `An error occured in the response: \`${err}\`` });
        }
    }
};
