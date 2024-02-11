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

const { Command } = require('discord-akairo');
const { PermissionsBitField } = require('discord.js');
const { toMilliseconds } = require('colon-notation');

module.exports = class CommandMaxTime extends Command {
    constructor () {
        super('maxtime', {
            aliases: ['maxtime'],
            category: '⚙ Settings',
            description: {
                text: 'Allows you to restrict songs from being added to the queue if the duration of the video exceeds this.',
                usage: '<duration>',
                details: '`<duration>` The max duration of the song to limit. Members will be unable to add any songs that go past this limit.'
            },
            clientPermissions: [PermissionsBitField.Flags.EmbedLinks],
            userPermissions: [PermissionsBitField.Flags.ManageGuild],
            args: [
                {
                    id: 'time',
                    type: 'string'
                }
            ]
        });
    }

    async exec (message, args) {
        const time = args.time;
        if (!time) return this.client.ui.usage(message, 'maxtime <duration|0/none/off>');

        if (time === 0 || time === 'NONE'.toLowerCase() || time === 'OFF'.toLowerCase()) {
            await this.client.settings.delete(message.guild.id, 'maxTime');
            return this.client.ui.reply(message, 'ok', 'Max time has been disabled.');
        }

        const notation = toMilliseconds(time);
        if (!notation) return message.error(`\`${time}\` doesn't parse to a time format. The format must be \`xx:xx\`.`);

        await this.client.settings.set(message.guild.id, notation, 'maxTime');
        return this.client.ui.reply(message, 'ok', `Max time has been set to \`${time}\``);
    }
};
