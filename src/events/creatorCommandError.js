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

module.exports = class ListenerCreatorCommandError extends Listener {
    constructor () {
        super('creatorCommandError', {
            emitter: 'creator',
            event: 'commandError'
        });
    }

    async exec (command, err, ctx) {
        await ctx.defer();

        switch (err.type) {
        case 'NO_DMS_ALLOWED': {
            return this.client.ui.reply(ctx, 'no', 'This command cannot be used in Direct Messages.');
        }
        default: {
            await this.client.ui.custom(ctx, '💢', process.env.COLOR_ERROR, `\`${err}\``, 'Bruh Moment', 'Something bad happened. A report was sent to the bot owner.');
            this.client.ui.systemMessage(this.client, ':x: **Slash Command Error**\nPlease report this to the developer.', command.commandName, err);
            this.client.logger.error(`[SlashCreator] Error in slash command "${command.commandName}"\n${err.stack}`);
        }
        }
    }
};
