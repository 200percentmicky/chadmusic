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

const { stripIndents } = require('common-tags');
const { Command } = require('discord-akairo');

module.exports = class CommandEmitSongAdd extends Command {
    constructor () {
        super('emitsongadd', {
            aliases: ['emitsongadd'],
            category: '⚙ Settings',
            description: {
                text: 'Toggles the ability to send a message when a track is added to the queue.',
                usage: '<toggle:on/off/true/false/nocreate>',
                details: stripIndents`
                \`<toggle:on/off/true/false>\` The toggle of the setting.
                
                \`on\` / \`true\` - Enabled
                \`off\` / \`false\` - Disabled
                \`nocreate\` - [Default] Enabled, but no message is sent when a player is created.
                `
            },
            ownerOnly: true,
            args: [
                {
                    id: 'toggle',
                    match: 'text'
                }
            ]
        });
    }

    async exec (message, args) {
        if (!args.toggle) return this.client.ui.usage(message, 'emitsongadd <toggle:on/off/true/false\nocreate>');

        const settings = this.client.settings;
        switch (args.toggle) {
        case 'true':
        case 'on': {
            await settings.set(message.guild.id, true, 'emitSongAddAlert');
            this.client.ui.reply(message, 'ok', 'Enabled song add messages.');
            break;
        }

        case 'false':
        case 'off': {
            await settings.set(message.guild.id, false, 'emitSongAddAlert');
            this.client.ui.reply(message, 'ok', 'Disabled song add messages.');
            break;
        }

        case 'nocreate': {
            await settings.set(message.guild.id, 'nocreate', 'emitSongAddAlert');
            this.client.ui.reply(message, 'ok', 'Enabled song add messages.', null, 'No message will be sent when a player is created.');
            break;
        }

        default: {
            this.client.ui.reply(message, 'error', 'Toggle must be **on**, **off**, or a boolean value.');
            break;
        }
        }
    }
};
