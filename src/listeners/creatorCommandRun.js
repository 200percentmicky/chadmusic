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

module.exports = class ListenerCreatorCommandRun extends Listener {
    constructor () {
        super('creatorCommandRun', {
            emitter: 'creator',
            event: 'commandRun'
        });
    }

    async exec (command, promise, ctx) {
        // Adding guild, channel, and member info from Discord.js into CommandContext.
        const guild = this.client.guilds.cache.get(ctx.guildID);

        let channel;
        let member;

        if (guild.available) {
            channel = guild.channels.cache.get(ctx.channelID);
            member = guild.members.cache.get(ctx.user.id);
        }

        Object.assign(ctx, {
            guild: guild,
            channel: channel,
            member: member
        });

        this.client.settings.ensure(ctx.guildID, this.client.defaultSettings);
    }
};
