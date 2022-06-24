/**
 *  Micky-bot
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
const { MessageEmbed } = require('discord.js');

module.exports = class CommandRestart extends Command {
    constructor () {
        super('restart', {
            aliases: ['restart', 'jsrestart'],
            ownerOnly: true,
            category: '💻 Core',
            description: {
                text: 'Attempts to restart the bot.',
                usage: '[reason]',
                details: '`[reason]` The reason for restarting the bot.'
            }
        });
    }

    async exec (message) {
        const args = message.content.split(/ +/g);
        let restartReport = args.slice(1).join(' ');
        if (!restartReport) restartReport = 'Just refreshing... nothing serious. :3';
        const errChannel = this.client.channels.cache.find(val => val.id === process.env.BUG_CHANNEL);
        await message.channel.send('🔄 Restarting...');
        const embed = new MessageEmbed()
            .setColor(process.env.COLOR_INFO)
            .setTitle('🔄 Restart')
            .setDescription(`\`\`\`js\n${restartReport}\`\`\``)
            .setTimestamp();
        await errChannel.send({ embeds: [embed] });
        this.client.logger.info('[Restart] %s', restartReport);
        this.client.logger.warn('Shutting down...');
        this.client.destroy();
        process.exit(0);
    }
};
