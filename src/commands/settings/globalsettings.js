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

const { stripIndents } = require('common-tags');
const { Command } = require('discord-akairo');
const { EmbedBuilder } = require('discord.js');
const { version } = require('../../../package.json');

module.exports = class CommandGlobalSettings extends Command {
    constructor () {
        super('globalsettings', {
            aliases: ['globalsettings'],
            category: '⚙ Settings',
            description: {
                text: 'Shows you the bot\'s current global settings.'
            },
            ownerOnly: true
        });
    }

    async exec (message) {
        const settings = this.client.settings;

        await settings.ensure('global', this.client.defaultGlobalSettings);

        // Global Settings
        const emitNewSongOnly = settings.get('global', 'emitNewSongOnly'); // Show New Song Only
        const emptyCooldown = settings.get('global', 'emptyCooldown'); // Empty Cooldown
        const leaveOnEmpty = settings.get('global', 'leaveOnEmpty'); // Leave on Empty
        const leaveOnFinish = settings.get('global', 'leaveOnFinish'); // Leave on Finish
        const leaveOnStop = settings.get('global', 'leaveOnStop'); // Leave on Stop
        const streamType = settings.get('global', 'streamType'); // Audio Encoder

        const encoderType = {
            0: 'Opus',
            1: 'RAW'
        };

        const embed = new EmbedBuilder()
            .setColor(message.guild.members.me.displayColor !== 0 ? message.guild.members.me.displayColor : null)
            .setAuthor({
                name: `ChadMusic v${version}`,
                iconURL: 'https://media.discordapp.net/attachments/375453081631981568/808626634210410506/deejaytreefiddy.png'
            })
            .setTitle(':globe_with_meridians: Global Settings')
            .setDescription(stripIndents`
                **Audio Encoder:** ${encoderType[streamType]}
                **Show New Song Only:** ${emitNewSongOnly === true ? 'On' : 'Off'}
                `
            )
            .setTimestamp();

        return message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    }
};
