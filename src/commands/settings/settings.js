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
const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const { toColonNotation } = require('colon-notation');
const { version } = require('../../../package.json');

module.exports = class CommandSettings extends Command {
    constructor () {
        super('settings', {
            aliases: ['settings'],
            category: '⚙ Settings',
            description: {
                text: 'Shows you the current settings of the bot for this server.'
            },
            clientPermissions: [PermissionsBitField.Flags.EmbedLinks],
            userPermissions: [PermissionsBitField.Flags.ManageGuild]
        });
    }

    async exec (message) {
        const settings = this.client.settings;

        await settings.ensure(message.guild.id, this.client.defaultSettings);

        // All Settings
        const prefix = settings.get(message.guild.id, 'prefix'); // Server Prefix
        const djRole = settings.get(message.guild.id, 'djRole'); // DJ Role
        const djMode = settings.get(message.guild.id, 'djMode'); // Toggle DJ Mode
        const maxTime = settings.get(message.guild.id, 'maxTime'); // Max Song Duration
        const maxQueueLimit = settings.get(message.guild.id, 'maxQueueLimit'); // Max Entries in the Queue
        const allowFilters = settings.get(message.guild.id, 'allowFilters'); // Allow the use of Filters
        const allowFreeVolume = settings.get(message.guild.id, 'allowFreeVolume'); // Unlimited Volume
        const allowLinks = settings.get(message.guild.id, 'allowLinks'); // Allow Links
        const allowSilent = settings.get(message.guild.id, 'allowSilent'); // Allow Silent Tracks
        const defaultVolume = settings.get(message.guild.id, 'defaultVolume'); // Default Volume
        const textChannel = settings.get(message.guild.id, 'textChannel'); // Text Channel
        const thumbnailSize = settings.get(message.guild.id, 'thumbnailSize'); // Thumbnail Size
        const votingPercent = settings.get(message.guild.id, 'votingPercent'); // Voting Percentage
        const leaveOnEmpty = settings.get(message.guild.id, 'leaveOnEmpty'); // Leave on Empty
        const leaveOnFinish = settings.get(message.guild.id, 'leaveOnFinish'); // Leave on Finish
        const leaveOnStop = settings.get(message.guild.id, 'leaveOnStop'); // Leave on Stop
        const emptyCooldown = settings.get(message.guild.id, 'emptyCooldown'); // Empty Cooldown
        const songVcStatus = settings.get(message.guild.id, 'songVcStatus'); // Track Title as VC Status

        // ! This setting only affects videos from YouTube.
        // All pornographic websites are blocked.
        const allowAgeRestricted = settings.get(message.guild.id, 'allowAgeRestricted', true); // Allow Explicit Content.

        const embed = new EmbedBuilder()
            .setColor(message.guild.members.me.displayColor !== 0 ? message.guild.members.me.displayColor : null)
            .setAuthor({
                name: `${message.guild.name}`,
                iconURL: message.guild.iconURL({ dynamic: true })
            })
            .setTitle(':gear: Settings')
            .addFields({
                name: ':notes: Player',
                value: stripIndents`
                **:interrobang: Prefix:** \`${prefix}\`
                **:bookmark: DJ Role:** ${djRole ? `<@&${djRole}>` : 'None'}
                **:microphone: DJ Mode:** ${djMode === true ? 'On' : 'Off'}
                **:frame_photo: Thumbnail Size:** ${thumbnailSize === 'large' ? 'Large' : 'Small'}
                **:loud_sound: Default Volume:** ${defaultVolume}
                **:hash: Text Channel:** ${textChannel ? `<#${textChannel}>` : 'Any'}
                **:mailbox_with_no_mail: Leave On Empty:** ${leaveOnEmpty === true ? 'On' : 'Off'}
                **:checkered_flag: Leave On Finish:** ${leaveOnFinish === true ? 'On' : 'Off'}
                **:stop_sign: Leave On Stop:** ${leaveOnStop === true ? 'On' : 'Off'}
                **:hourglass_flowing_sand: Empty Cooldown:** ${parseInt(emptyCooldown)} seconds
                **:speech_balloon: Track Title as VC Status:** ${songVcStatus === true ? 'On' : 'Off'}
                `
            },
            {
                name: ':shield: Moderation',
                value: stripIndents`
                **:timer: Max Song Time:** ${maxTime ? toColonNotation(maxTime) : 'Unlimited'}
                **:1234: Max Entries in the Queue:** ${maxQueueLimit || 'Unlimited'}
                **:loudspeaker: Allow Filters:** ${allowFilters ? 'Yes' : 'No'}
                **:joy: Unlimited Volume:** ${allowFreeVolume === true ? 'On' : 'Off'}
                **:link: Allow Links:** ${allowLinks === true ? 'Yes' : 'No'}
                **:underage: Allow Explicit Content:** ${allowAgeRestricted === true ? 'Yes' : 'No'}
                **:shushing_face: Allow Silent Tracks:** ${allowSilent === true ? 'Yes' : 'No'}
                **:raised_hand: Vote-skip Percentage:** ${parseFloat(votingPercent) * 100}%
                `
            })
            .setTimestamp()
            .setFooter({
                text: `ChadMusic v${version}`,
                iconURL: 'https://media.discordapp.net/attachments/375453081631981568/808626634210410506/deejaytreefiddy.png'
            });

        return message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    }
};
