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

module.exports = class CommandFreeVolume extends Command {
    constructor () {
        super('freevolume', {
            aliases: ['freevolume'],
            category: '⚙ Settings',
            description: {
                text: 'Toggles the ability to change the volume past 200%.',
                usage: '<toggle:on/off>'
            },
            clientPermissions: [PermissionsBitField.Flags.EmbedLinks],
            userPermissions: [PermissionsBitField.Flags.ManageGuild]
        });
    }

    async exec (message) {
        const args = message.content.split(/ +/g);
        const volume = this.client.settings.get(message.guild.id, 'defaultVolume');
        if (!args[1]) return this.client.ui.usage(message, 'freevolume <toggle:on/off>');
        if (args[1] === 'OFF'.toLowerCase()) {
            const queue = this.client.player.getQueue(message);
            if (queue) {
                if (queue.volume > 200) this.client.player.setVolume(message, volume);
            }
            await this.client.settings.set(message.guild.id, false, 'allowFreeVolume');
            return this.client.ui.reply(message, 'ok', 'Unlimited Volume has been **disabled**. Volume is now limited to **200%**.');
        } else if (args[1] === 'ON'.toLowerCase()) {
            await this.client.settings.set(message.guild.id, true, 'allowFreeVolume');
            return this.client.ui.reply(message, 'ok', 'Unlimited Volume has been **enabled**.');
        } else {
            return this.client.ui.reply(message, 'error', 'Toggle must be **on** or **off**.');
        }
    }
};
