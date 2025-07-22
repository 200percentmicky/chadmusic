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
const _ = require('lodash');

module.exports = class CommandSudo extends Command {
    constructor () {
        super('sudo', {
            aliases: ['sudo'],
            description: {
                text: 'Grants or denies the bot owner DJ permissions in the given server.',
                details: ':warning: Sudo access is per server, not globally. Sudo is also disabled by default and resets everytime the bot restarts.'
            },
            category: '💻 Core',
            ownerOnly: true
        });
    }

    async exec (message) {
        const sudo = this.client.player.sudoAccess;

        if (sudo.includes(message.guild.id)) {
            _.remove(sudo, g => {
                return g === message.guild.id;
            });
            return this.client.ui.reply(message, 'info', 'Disabled sudo access on this server.');
        }

        if (await this.client.utils.isDJ(message.channel, message.member)) {
            return this.client.ui.reply(message, 'warn', 'You\'re already a DJ in this server.');
        }

        sudo.push(message.guild.id);
        return this.client.ui.reply(message, 'info', 'Enabled sudo access on this server.');
    }
};
