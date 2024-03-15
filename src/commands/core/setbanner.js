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
const { ActivityType } = require('discord.js')

module.exports = class CommandSetBanner extends Command {
    constructor () {
        super('setbanner', {
            aliases: ['setbanner'],
            description: {
                text: "Changes the bot's profile banner.",
                usage: '[attachment]',
                details: '`[attachment]` The attachment to use for the banner, or the URL of an image. Supports GIF, JPEG, or PNG formats. If none is provided, removes the banner.'
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
        const imageUrl = args.image ?? message.attachments?.first()?.url

        let imageFormat;
        try {
            imageFormat = imageUrl.match(/(gif|jpg|png)/g)[0]
        } catch {
            return this.client.ui.reply(message, 'error', `:x: Supported image formats are GIF, JPEG, or PNG.`);
        }

        const image = await fetch(imageUrl);
        const buffer = Buffer.from(await image.arrayBuffer()).toString('base64');
        
        try {
            await this.client.rest.patch(`/users/@me`, {
                    body: {
                        banner: imageUrl ? `data:image/${imageFormat};base64,` + buffer : null
                    }
                }
            );
            return message.react('✅');
        } catch (err) {
            return message.reply({ content: `:x: An error occured in the response: \`${err}\``})
        }
    }
};
