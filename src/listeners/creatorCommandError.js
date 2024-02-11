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

        switch (err.type) {
        case 'NO_DMS_ALLOWED': {
            return this.client.ui.reply(ctx, 'no', 'This command cannot be used in Direct Messages.');
        }
        default: {
            let guru = '**💢 Bruh Moment**\nSomething bad happened. Please report this to the developer.';

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

            await ctx.send({ content: `${guru}`, components: [actionRow] });
            this.client.ui.recordError(this.client, command.commandName, ':x: Slash Command Error', err.stack);
            this.client.logger.error(`[SlashCreator] Error in slash command "${command.commandName}"\n${err.stack}`);
        }
        }
    }
};
