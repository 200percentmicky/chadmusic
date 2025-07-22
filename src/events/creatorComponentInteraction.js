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
        switch (ctx.customID) {
        case 'sc_close_eval': {
            if (this.client.owner?.id !== ctx.user.id) return ctx.sendFollowUp(':no_entry_sign: Only the owner of this application can use this command.', { ephemeral: true });

            ctx.acknowledge();
            ctx.delete();
        }
        }
    }
};
