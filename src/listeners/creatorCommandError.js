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
const { ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');

module.exports = class ListenerCreatorCommandError extends Listener {
    constructor () {
        super('creatorCommandError', {
            emitter: 'creator',
            event: 'commandError'
        });
    }

    async exec (command, err, ctx) {
        await ctx.defer();
        let guru = 'Something bad happened. Please report this to the developer.';

        const guild = this.client.guilds.cache.get(ctx.guildID);
        if (guild.channels.cache.get(process.env.BUG_CHANNEL)) {
            guru += ' The owner of this application has also received an error report.\n';
        }

        guru += `\`\`\`js\n${err.stack}\`\`\``;

        const urlGithub = new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setURL('https://github.com/200percentmicky/chadmusic')
            .setLabel('GitHub');

        const support = new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setURL('https://discord.com/invite/qQuJ9YQ')
            .setLabel('Support Server');

        const actionRow = new ActionRowBuilder()
            .addComponents([urlGithub, support]);

        await this.client.ui.custom(ctx, '💢', process.env.COLOR_ERROR, `${guru}`, 'Bruh Moment', null, null, [actionRow]);
        this.client.ui.recordError(this.client, command.commandName, '❌ Command Error', err.stack);
        this.client.logger.error('[SlashCreator] Error in command "%s": %s', command.commandName, err.stack);
    }
};
