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

const { Command } = require('discord-akairo');

module.exports = class CommandShowNewSongOnly extends Command {
    constructor () {
        super('shownewsongonly', {
            aliases: ['shownewsongonly', 'emitnewsongonly'],
            category: '⚙ Settings',
            description: {
                text: 'Toggles whether the Now Playing alerts are shown for new songs only.',
                usage: '<toggle:on/off>',
                details: `\`<toggle:on/off>\` The toggle of the setting.`
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
        if (!args[1]) return this.client.ui.usage(message, 'shownewsongonly <toggle:on/off>');

        const settings = this.client.settings;
        switch (args.text) {
        case 'on': {
            await settings.set('global', true, 'emitNewSongOnly');
            this.client.player.options.emitNewSongOnly = true;
            this.client.ui.reply(message, 'ok', 'Now Playing alerts will now only show for new songs.');
            break;
        }
        case 'off': {
            await settings.set('global', false, 'emitNewSongOnly');
            this.client.player.options.emitNewSongOnly = false;
            this.client.ui.reply(message, 'ok', 'Now Playing alerts will now show for every song.');
            break;
        }
        default: {
            this.client.ui.reply(message, 'error', 'Toggle must be **on** or **off**.');
            break;
        }
        }
    }
};
