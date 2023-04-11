/**
 *  ChadMusic - The Chad Music Bot
 *  Copyright (C) 2023  Micky D. | @200percentmicky | Micky-kun#3836
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

module.exports = class CommandShutdown extends Command {
    constructor () {
        super('shutdown', {
            aliases: ['shutdown', 'poweroff'],
            ownerOnly: true,
            category: '💻 Core',
            description: {
                text: 'Shuts down the bot.',
                usage: '[reason]',
                details: '`[reason]` The reason for shutting down the bot.'
            }
        });
    }

    async exec (message) {
        const args = message.content.split(/ +/g);
        let restartReport = args.slice(1).join(' ');
        if (!restartReport) restartReport = 'No reason. See ya! 👋';
        this.client.logger.warn('Cleaning up before shutting down...');
        const errChannel = this.client.channels.cache.find(val => val.id === process.env.BUG_CHANNEL);
        await message.reply('⚠ Shutting down...');
        await errChannel.send({ content: `⚠ **Shutdown**\n\`\`\`js\n${restartReport}\`\`\`` });
        this.client.logger.info('[Shutdown] %s', restartReport);
        this.client.logger.warn('Shutting down...');
        this.client.creator.cleanRegisteredComponents();
        this.client.destroy();
        process.exit(0);
    }
};
