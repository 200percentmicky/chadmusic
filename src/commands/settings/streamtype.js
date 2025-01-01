/// ChadMusic - The Chad Music Bot
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

const { stripIndent } = require('common-tags');
const { Command } = require('discord-akairo');

module.exports = class CommandStreamType extends Command {
    constructor () {
        super('streamtype', {
            aliases: ['streamtype'],
            category: '⚙ Settings',
            description: {
                text: 'Selects which audio encoder the bot should use during streams.',
                usage: '<encoder:opus/raw>',
                details: stripIndent`
                \`<encoder:opus/raw>\` The audio encoder to use.
                **opus** - Uses the Opus encoder. Better quality, uses more resources.
                **raw** - Uses a RAW encoder. Better performance, uses less resources.
                `
            },
            ownerOnly: true,
            args: [
                {
                    id: 'encoder',
                    match: 'text'
                }
            ]
        });
    }

    async exec (message, args) {
        if (!args.encoder) return this.client.ui.usage(message, 'streamtype <encoder:opus/raw>');

        const settings = this.client.settings;
        switch (args.encoder) {
        case 'opus': {
            await settings.set('global', 0, 'streamType');
            this.client.player.options.streamType = 0;
            this.client.ui.reply(message, 'ok', 'Audio encoder has been set to **opus**.');
            break;
        }
        case 'raw': {
            await settings.set('global', 1, 'streamType');
            this.client.player.options.streamType = 1;
            this.client.ui.reply(message, 'ok', 'Audio encoder has been set to **raw**.');
            break;
        }
        default: {
            this.client.ui.reply(message, 'error', 'Toggle must be **opus** or **raw**.');
            break;
        }
        }
    }
};
