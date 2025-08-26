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
const { ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');

module.exports = class LicenseCommand extends Command {
    constructor () {
        super('license', {
            aliases: ['license'],
            description: {
                text: 'View this program\'s license.'
            },
            category: '💻 Core'
        });
    }

    async exec (message) {
        const urlGithub = new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setURL('https://github.com/200percentmicky/chadmusic')
            .setLabel('GitHub');

        const support = new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setURL('https://discord.com/invite/qQuJ9YQ')
            .setLabel('Support Server');

        const docsButton = new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setURL('https://200percentmicky.github.io/chadmusic')
            .setLabel('Documentation');

        const actionRow = new ActionRowBuilder()
            .addComponents([urlGithub, support, docsButton]);

        const license = {
            content: stripIndents`
            This application is running an instance of **[ChadMusic](https://github.com/200percentmicky/chadmusic)**

            This program is licensed under the GNU General Public License version 3.

            ChadMusic
            Copyright (C) 2025  Micky | 200percentmicky

            This program is free software: you can redistribute it and/or modify
            it under the terms of the GNU General Public License as published by
            the Free Software Foundation, either version 3 of the License, or
            (at your option) any later version.
            
            This program is distributed in the hope that it will be useful,
            but WITHOUT ANY WARRANTY; without even the implied warranty of
            MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
            GNU General Public License for more details.
            
            You should have received a copy of the GNU General Public License
            along with this program.  If not, see <https://www.gnu.org/licenses/>.
            `,
            components: [actionRow]
        };

        try {
            await message.member.user.send(license);
            return message.react(process.env.REACTION_MUSIC).catch(() => {});
        } catch {
            return message.reply(license);
        }
    }
};
