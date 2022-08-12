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

const { stripIndents } = require('common-tags');
const { Command } = require('discord-akairo');
const { EmbedBuilder } = require('discord.js');
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
            clientPermissions: ['EMBED_LINKS'],
            userPermissions: ['MANAGE_GUILD']
        });
    }

    async exec (message) {
        const settings = this.client.settings;

        settings.ensure(message.guild.id, this.client.defaultSettings);

        // All Settings
        const prefix = settings.get(message.guild.id, 'prefix'); // Server Prefix
        const djRole = settings.get(message.guild.id, 'djRole'); // DJ Role
        const djMode = settings.get(message.guild.id, 'djMode'); // Toggle DJ Mode
        const maxTime = settings.get(message.guild.id, 'maxTime'); // Max Song Duration
        const maxQueueLimit = settings.get(message.guild.id, 'maxQueueLimit'); // Max Entries in the Queue
        const allowFilters = settings.get(message.guild.id, 'allowFilters'); // Allow the use of Filters
        const allowFreeVolume = settings.get(message.guild.id, 'allowFreeVolume'); // Unlimited Volume
        const allowLinks = settings.get(message.guild.id, 'allowLinks'); // Allow Links
        const defaultVolume = settings.get(message.guild.id, 'defaultVolume'); // Default Volume
        const textChannel = settings.get(message.guild.id, 'textChannel'); // Text Channel
        const blockedPhrases = settings.get(message.guild.id, 'blockedPhrases'); // Blocked Songs
        // const voiceChannel = settings.get(message.guild.id, 'voiceChannel', null) // Voice Channel

        // ! This setting only affects videos from YouTube.
        // All pornographic websites are blocked.
        const allowAgeRestricted = settings.get(message.guild.id, 'allowAgeRestricted', true); // Allow Explicit Content.

        const embed = new EmbedBuilder()
            .setColor(message.guild.me.displayColor !== 0 ? message.guild.me.displayColor : null)
            .setAuthor({
                name: `${message.guild.name}`,
                iconURL: message.guild.iconURL({ dynamic: true })
            })
            .setTitle(':gear: Settings')
            .setDescription(stripIndents`
            **⁉ Prefix:** \`${prefix}\`
            **🔖 DJ Role:** ${djRole ? `<@&${djRole}>` : 'None'}
            **🎤 DJ Mode:** ${djMode === true ? 'On' : 'Off'}
            **⏲ Max Song Time:** ${maxTime ? toColonNotation(maxTime) : 'Unlimited'}
            **🔢 Max Entries in the Queue:** ${maxQueueLimit || 'Unlimited'}
            **📢 Allow Filters:** ${allowFilters === true ? 'Yes' : 'No'}
            **😂 Unlimited Volume:** ${allowFreeVolume === true ? 'On' : 'Off'}
            **🔗 Allow Links:** ${allowLinks === true ? 'Yes' : 'No'}
            **🔞 Allow Explicit Content:** ${allowAgeRestricted === true ? 'Yes' : 'No'}
            **🔊 Default Volume:** ${defaultVolume}
            **#️⃣ Text Channel:** ${textChannel ? `<#${textChannel}>` : 'Any'} 
            `)
            .setTimestamp()
            .setFooter({
                text: `ChadMusic v${version}`,
                iconURL: 'https://media.discordapp.net/attachments/375453081631981568/808626634210410506/deejaytreefiddy.png'
            });

        const blockedEmbed = new EmbedBuilder()
            .setColor(message.guild.me.displayColor !== 0 ? message.guild.me.displayColor : null)
            .setAuthor({
                name: `${message.guild.name}`,
                iconURL: message.guild.iconURL({ dynamic: true })
            })
            .setDescription(`\`\`\`${blockedPhrases.join(', ')}\`\`\``)
            .setTitle('🎶❌ Blocked Songs')
            .setTimestamp()
            .setFooter({
                text: `ChadMusic v${version}`,
                iconURL: 'https://media.discordapp.net/attachments/375453081631981568/808626634210410506/deejaytreefiddy.png'
            });

        if (blockedPhrases.length === 0) {
            blockedEmbed.setDescription('');
            blockedEmbed.addField(`${process.env.EMOJI_INFO} Nothing is currently in this server's blocklist.`, `To add phrases to the blocklist, run \`${process.env.PREFIX}blocklist add <phrase>\`.`);
        }

        return message.reply({ embeds: [embed, blockedEmbed], allowedMentions: { repliedUser: false } });
    }
};
