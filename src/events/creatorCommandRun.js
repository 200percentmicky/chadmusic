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
const { ChannelType } = require('discord.js');

module.exports = class ListenerCreatorCommandRun extends Listener {
    constructor () {
        super('creatorCommandRun', {
            emitter: 'creator',
            event: 'commandRun'
        });
    }

    async exec (command, promise, ctx) {
        try {
            this.client.settings.ensure(ctx.guildID, this.client.defaultSettings);
        } catch (err) {
            if (ctx.channel.type === ChannelType.DM) {
                this.client.logger.warn(`Command executed in direct message. Ignoring exception...\n${err.stack}`);
            } else {
                this.client.logger.error(`Cannot attach objects or ensure default settings for Guild ID ${ctx.guildID}.\n${err.stack}`);
            }
        }
    }
};
