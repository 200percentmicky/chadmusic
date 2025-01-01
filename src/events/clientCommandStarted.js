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

const { Listener } = require('discord-akairo');
const { CommandHandlerEvent } = require('discord-akairo/dist/src/util/Constants');
const { ChannelType } = require('discord.js');

module.exports = class ListenerClientCommandStarted extends Listener {
    constructor () {
        super('clientCommandStarted', {
            emitter: 'commandHandler',
            event: CommandHandlerEvent.COMMAND_STARTED
        });
    }

    async exec (message, command, args) {
        try {
            this.client.settings.ensure(message.guild.id, this.client.defaultSettings);
        } catch (err) {
            if (message.channel.type === ChannelType.DM) {
                this.client.logger.warn(`Command executed in direct message. Ignoring exception...\n${err.stack}`);
            } else {
                this.client.logger.error(`Cannot ensure default settings for Guild ID ${message.guild.id}.\n${err.stack}`);
            }
        }
    }
};
