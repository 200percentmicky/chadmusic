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

const { Command } = require('discord-akairo');

module.exports = class CommandAllowYouTube extends Command {
    constructor () {
        super('allowyoutube', {
            aliases: ['allowyoutube'],
            category: '⚙ Settings',
            description: {
                text: 'Toggles the ability to allow tracks from YouTube to be added to the player.',
                usage: '<toggle:on/off/true/false>',
                details: '`<toggle:on/off/true/false>` The toggle of the setting.'
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
        if (!args.toggle) return this.client.ui.usage(message, 'allowyoutube <toggle:on/off/true/false>');

        const settings = this.client.settings;
        switch (args.toggle) {
        case 'true':
        case 'on': {
            await settings.set('global', true, 'allowYouTube');
            this.client.ui.reply(message, 'ok', 'Enabled YouTube support.');
            break;
        }
        case 'false':
        case 'off': {
            await settings.set('global', false, 'allowYouTube');
            this.client.ui.reply(message, 'ok', 'Disabled YouTube support.');
            break;
        }
        default: {
            this.client.ui.reply(message, 'error', 'Toggle must be **on**, **off**, or a boolean value.');
            break;
        }
        }
    }
};
