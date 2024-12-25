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

const { Listener } = require('discord-akairo');
const { CommandHandlerEvent } = require('discord-akairo/dist/src/util/Constants');
const { ChannelType } = require('discord.js');

module.exports = class CommandBlockedListener extends Listener {
    constructor () {
        super('commandBlocked', {
            emitter: 'commandHandler',
            event: CommandHandlerEvent.COMMAND_BLOCKED
        });
    }

    async exec (message, command, reason) {
        if (reason === 'owner') return this.client.ui.reply(message, 'no', 'This command is only available to the application owner.');
        if (reason === 'guild') return this.client.ui.reply(message, 'no', 'This command cannot be used in Direct Messages.');
        if (reason === ChannelType.DM) return this.client.ui.reply(message, 'no', 'This command cannot be used in servers.');
    }
};
