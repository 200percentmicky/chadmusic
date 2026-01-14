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
const { PermissionsBitField, GuildFeature } = require('discord.js');

module.exports = class CommandAllowYouTube extends Command {
    constructor () {
        super('allowexplicitsites', {
            aliases: ['allowexplicitsites', 'allowporn'],
            category: '⚙ Settings',
            description: {
                text: `Toggles the ability to allow tracks from explicit websites to be added to the queue.\n\n${process.env.EMOJI_WARN} Partnered servers are forbidden from toggling this setting.`,
                usage: '<toggle:on/off/true/false>',
                details: '`<toggle:on/off/true/false>` The toggle of the setting.'
            },
            userPermissions: [PermissionsBitField.Flags.ManageGuild],
            args: [
                {
                    id: 'toggle',
                    match: 'text'
                }
            ]
        });
    }

    async exec (message, args) {
        if (message.guild.features.includes(GuildFeature.Partnered)) {
            return this.client.ui.reply(message, 'no', 'Partnered servers are forbidden from toggling this setting.');
        }

        if (!args.toggle) return this.client.ui.usage(message, 'allowexplicitsites <toggle:on/off/true/false>');

        const settings = this.client.settings;
        switch (args.toggle) {
        case 'true':
        case 'on': {
            await settings.set(message.guild.id, true, 'allowPorn');
            this.client.ui.reply(message, 'ok', 'Enabled explicit website support.');
            break;
        }
        case 'false':
        case 'off': {
            await settings.set(message.guild.id, false, 'allowPorn');
            this.client.ui.reply(message, 'ok', 'Disabled explicit website support.');
            break;
        }
        default: {
            this.client.ui.reply(message, 'error', 'Toggle must be **on**, **off**, or a boolean value.');
            break;
        }
        }
    }
};
