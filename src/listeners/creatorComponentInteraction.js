/// ChadMusic - The Chad Music Bot
/// Copyright (C) 2023  Micky D. | @200percentmicky | Micky-kun#3836
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

// For various interactions throughout the bot. (Excluding Discord.js interactions.)

module.exports = class ListenerCreatorComponentInteraction extends Listener {
    constructor () {
        super('creatorComponentInteraction', {
            emitter: 'creator',
            event: 'componentInteraction'
        });
    }

    async exec (ctx) {
        const app = await this.client.application.fetch();

        switch (ctx.customID) {
        case 'sc_close_eval': {
            if (app.owner?.id !== ctx.user.id) return ctx.sendFollowUp('🚫 Only the owner of this application can use this command.', { ephemeral: true });

            ctx.acknowledge();
            ctx.delete();
        }
        }
    }
};
