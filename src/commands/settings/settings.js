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
        const prefix = settings.get(message.guild.id, 'prefix', process.env.PREFIX); // Server Prefix
        // const timezone = settings.get(message.guild.id, 'timezone', 'UTC') // Time Zone
        const djRole = settings.get(message.guild.id, 'djRole', null); // DJ Role
        const djMode = settings.get(message.guild.id, 'djMode', false); // Toggle DJ Mode
        const maxTime = settings.get(message.guild.id, 'maxTime', null); // Max Song Duration
        const maxQueueLimit = settings.get(message.guild.id, 'maxQueueLimit', null); // Max Entries in the Queue
        const allowFilters = settings.get(message.guild.id, 'allowFilters', 'all'); // Allow the use of Filters
        const allowFreeVolume = settings.get(message.guild.id, 'allowFreeVolume', true); // Unlimited Volume
        const defaultVolume = settings.get(message.guild.id, 'defaultVolume', 100); // Default Volume
        const textChannel = settings.get(message.guild.id, 'textChannel', null); // Text Channel
        // const voiceChannel = settings.get(message.guild.id, 'voiceChannel', null) // Voice Channel

        // ! This setting only affects videos from YouTube.
        // All pornographic websites are blocked.
        const allowAgeRestricted = settings.get(message.guild.id, 'allowAgeRestricted', true); // Allow Explicit Content.

        // Below are some old comments to when this use to be a multipurpose bot.
        // Preserving this just in case...

        /*
    const modlog = settings.get(message.guild.id, 'modlog', null); // Moderation Logs
    const taglog = settings.get(message.guild.id, 'taglog', null); // Tag Logs
    const guildMemberAdd = settings.get(message.guild.id, 'guildMemberAdd', null); // User Join
    const guildMemberRemove = settings.get(message.guild.id, 'guildMemberRemove', null); // User Leave
    const guildMemberUpdate = settings.get(message.guild.id, 'guildMemberUpdate', null); // User Update
    const messageDelete = settings.get(message.guild.id, 'messageDelete', null); // Deleted Messages
    const messageUpdate = settings.get(message.guild.id, 'messageUpdate', null); // Edited Messages
    const voiceStateUpdate = settings.get(message.guild.id, 'voiceStateUpdate', null); // User Voice State Update
    */
        // const noInvites = settings.get(message.guild.id, 'noInvites', null) // No Invite Links

        // const forumChannels = settings.get(message.guild.id, 'forumChannels', []); // List of Forum Channels

        const embed = new MessageEmbed()
            .setColor(message.guild.me.displayColor !== 0 ? message.guild.me.displayColor : null)
            .setAuthor({
                name: `${message.guild.name}`,
                iconURL: message.guild.iconURL({ dynamic: true })
            })
            .setTitle(':gear: Settings')
        // .addField('🌐 General', stripIndents`
        //* *Server Prefix:** \`${prefix}\`
        // `)
            .setDescription(stripIndents`
      **⁉ Prefix:** \`${prefix}\`
      **🔖 DJ Role:** ${djRole ? `<@&${djRole}>` : 'None'}
      **🎤 DJ Mode:** ${djMode === true ? 'On' : 'Off'}
      **⏲ Max Song Time:** ${maxTime ? toColonNotation(maxTime) : 'Unlimited'}
      **🔢 Max Entries in the Queue:** ${maxQueueLimit || 'Unlimited'}
      **📢 Allow Filters:** ${allowFilters === 'dj' ? 'DJ Only' : 'All'}
      **😂 Unlimited Volume:** ${allowFreeVolume === true ? 'On' : 'Off'}
      **🔞 Allow Explicit Content:** ${allowAgeRestricted === true ? 'Yes' : 'No'}
      **🔊 Default Volume:** ${defaultVolume}
      **#️⃣ Text Channel:** ${textChannel ? `<#${textChannel}>` : 'Any'}
      `)
        // **👁‍🗨 Voice Channel:** ${voiceChannel ? `<#!${voiceChannel}>` : 'Any'}
        /*
      .addField('📃 Logging', stripIndents`
      **Moderation Logs:** ${modlog ? `<#${modlog}>` : 'None'}
      **Tag Logs:** ${taglog ? `<#${taglog}>` : 'None'}
      **guildMemberAdd:** ${guildMemberAdd ? `<#${guildMemberAdd}>` : 'None'}
      **guildMemberRemove:** ${guildMemberRemove ? `<#${guildMemberRemove}>` : 'None'}
      **guildMemberUpdate:** ${guildMemberUpdate ? `<#${guildMemberUpdate}>` : 'None'}
      **messageDelete:** ${messageDelete ? `<#${messageDelete}>` : 'None'}
      **messageUpdate:** ${messageUpdate ? `<#${messageUpdate}>` : 'None'}
      **voiceStateUpdate:** ${voiceStateUpdate ? `<#${voiceStateUpdate}>` : 'None'}
      `, true)
      .addField('📰 Forum Channels', forumChannels.length > 0
        ? forumChannels.map(x => `<#${x}>`).join(', ')
        : 'There are no forum channels on this server.'
      , true)
      */
        /*
      .addField('🔨 Auto Moderation', stripIndents`
      **No Invites:** ${noInvites ? 'On' : 'Off'}
      `)
      .addField('🌟 Starboard', stripIndents`
      **Channel:** ${starboard ? `<#${starboard.channelID}>` : 'None'}
      **Emoji:** ${starboard ? starboard.options.emoji : 'Not configured'}
      **Threshold:** ${starboard ? starboard.options.threshold : 'Not configured'}
      **Color:** ${starboard ? starboard.options.color : 'Not configured'}
      **Post Attachments:** ${starboard
        ? starboard.options.attachment === true
          ? 'Yes'
          : 'No'
        : 'Not configured'}
      **Resolve Image URLs:** ${starboard
        ? starboard.options.resolveImageUrl === true
          ? 'Yes'
          : 'No'
        : 'Not configured'}
      **Self Star:** ${starboard
        ? starboard.options.selfStar === true
          ? 'Yes'
          : 'No'
        : 'Not configured'}
      **Star Bot Messages:** ${starboard
        ? starboard.options.starBotMsg === true
          ? 'Yes'
          : 'No'
        : 'Not configured'}
      **Star embeds:** ${starboard
        ? starboard.options.starEmbed === true
          ? 'Yes'
          : 'No'
        : 'Not configured'}
      **Allow NSFW:** ${starboard
        ? starboard.options.allowNsfw === true
          ? 'Yes'
          : 'No'
        : 'Not configured'}
      `)
      */
            .setTimestamp()
            .setFooter({
                text: `ChadMusic v${version}`,
                iconURL: 'https://cdn.discordapp.com/attachments/375453081631981568/808626634210410506/deejaytreefiddy.png'
            });

        return message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    }
};
