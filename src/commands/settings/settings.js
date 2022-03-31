const { stripIndents } = require('common-tags');
const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
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

        // All Settings
        const prefix = settings.get(message.guild.id, 'prefix'); // Server Prefix
        const djRole = settings.get(message.guild.id, 'djRole'); // DJ Role
        const djMode = settings.get(message.guild.id, 'djMode'); // Toggle DJ Mode
        const maxTime = settings.get(message.guild.id, 'maxTime'); // Max Song Duration
        const maxQueueLimit = settings.get(message.guild.id, 'maxQueueLimit'); // Max Entries in the Queue
        const allowFilters = settings.get(message.guild.id, 'allowFilters'); // Allow the use of Filters
        const allowFreeVolume = settings.get(message.guild.id, 'allowFreeVolume'); // Unlimited Volume
        const defaultVolume = settings.get(message.guild.id, 'defaultVolume'); // Default Volume
        const textChannel = settings.get(message.guild.id, 'textChannel'); // Text Channel
        // const voiceChannel = settings.get(message.guild.id, 'voiceChannel', null) // Voice Channel

        // ! This setting only affects videos from YouTube.
        // All pornographic websites are blocked.
        const allowAgeRestricted = settings.get(message.guild.id, 'allowAgeRestricted', true); // Allow Explicit Content.

        const embed = new MessageEmbed()
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
            **🔞 Allow Explicit Content:** ${allowAgeRestricted === true ? 'Yes' : 'No'}
            **🔊 Default Volume:** ${defaultVolume}
            **#️⃣ Text Channel:** ${textChannel ? `<#${textChannel}>` : 'Any'}
            `)
            .setTimestamp()
            .setFooter({
                text: `ChadMusic v${version}`,
                iconURL: 'https://cdn.discordapp.com/attachments/375453081631981568/808626634210410506/deejaytreefiddy.png'
            });

        return message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    }
};
