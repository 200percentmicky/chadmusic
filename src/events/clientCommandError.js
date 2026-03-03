/// ChadMusic
/// Copyright (C) 2026  Micky | 200percentmicky
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

module.exports = class ListenerClientCommandError extends Listener {
    constructor () {
        super('clientCommandError', {
            emitter: 'commandHandler',
            event: CommandHandlerEvent.ERROR
        });
    }

    async exec (error, message, command) {
        await message.channel.send({
            content: `:anger: **Bruh moment** - \`${error}\`\n-# Something bad happened. Please report this to the developer.${process.env.BUG_CHANNEL !== 'false'
                ? ' The bot owner has been notified.'
                : ''
            }`
        });

        this.client.ui.systemMessage(this.client, ':x: **Command Error**\nPlease report this to the developer.', command, error);
        this.client.logger.error(`[Client] Error in command "${command}"\n${error.stack}`);
    }
};
