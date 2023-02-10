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

const { Listener } = require('discord-akairo');
const { CommandContext } = require('slash-create');

module.exports = class ListenerClientCommandStarted extends Listener {
    constructor () {
        super('clientCommandStarted', {
            emitter: 'commandHandler',
            event: 'commandStarted'
        });
    }

    async exec (message, command, args) {
        if (message instanceof CommandContext) {
            const guild = this.client.guilds.cache.get(message.guildID);

            let channel;
            let member;

            if (guild.available) {
                channel = guild.channels.cache.get(message.channelID);
                member = guild.members.cache.get(message.user.id);
            }

            // Override the reply function since it doesn't exist.
            const reply = (string) => {
                return message.send(string);
            };

            // Override reaction to return null since it doesn't exist.
            const react = () => { return null; };

            Object.assign(message, {
                guild: guild,
                channel: channel,
                member: member,
                reply: reply,
                react: react
            });
        }
        this.client.settings.ensure(message.guild.id, this.client.defaultSettings);
    }
};
