const { stripIndents } = require('common-tags')
const { Command } = require('discord-akairo')
const { MessageEmbed } = require('discord.js')
const prettyMilliseconds = require('pretty-ms')

module.exports = class CommandSettings extends Command {
  constructor () {
    super('settings', {
      aliases: ['settings'],
      category: '🔑 Administration',
      description: {
        text: 'View the current settings for this server.'
      }
    })
  }

  async exec (message) {
    const settings = this.client.settings.get(message.guild.id)
    const starboard = this.client.starboard.starboards.find(x => x.guildID === message.guild.id)
    const embed = new MessageEmbed()
      .setColor(this.client.color.ok)
      .setAuthor(`Current Settings for ${message.guild.name}`, message.guild.iconURL({ dynamic: true }))
      .addField(this.client.emoji.cutie + 'General', stripIndents`
      **Server Prefix:** \`${this.client.prefix.getPrefix(message.guild.id) || this.client.config.prefix}\`
      **Time Zone:** ${settings.timezone}
      `)
      .addField('🎶 Music', stripIndents`
      **DJ Role:** ${settings.djRole ? `<@&${settings.djRole}>` : 'None'}
      **DJ Mode:** ${settings.djMode === true ? 'On' : 'Off'}
      **Max Song Time:** ${settings.maxTime ? prettyMilliseconds(settings.maxTime, { colonNotation: true }) : 'Unlimited'}
      **Max Entries in the Queue:** ${settings.maxQueueLimit ? settings.maxQueueLimit : 'Unlimited'}
      **Now Playing Alerts:** ${settings.nowPlayingAlerts === true ? 'On' : 'Off'}
      **Unlimited Volume:** ${settings.allowFreeVolume === true ? 'On' : 'Off'}
      `)
      .addField('📃 Logging', stripIndents`
      **Moderation Logs:** ${settings.modlog ? `<#${settings.modlog}>` : 'None'}
      **Tag Logs:** ${settings.taglog ? `<#${settings.taglog}>` : 'None'}
      **guildMemberAdd:** ${settings.guildMemberAdd ? `<#${settings.guildMemberAdd}>` : 'None'}
      **guildMemberRemove:** ${settings.guildMemberRemove ? `<#${settings.guildMemberRemove}>` : 'None'}
      **guildMemberUpdate:** ${settings.guildMemberUpdate ? `<#${settings.guildMemberUpdate}>` : 'None'}
      **messageDelete:** ${settings.messageDelete ? `<#${settings.messageDelete}>` : 'None'}
      **messageUpdate:** ${settings.messageUpdate ? `<#${settings.messageUpdate}>` : 'None'}
      **voiceStateUpdate:** ${settings.voiceStateUpdate ? `<#${settings.voiceStateUpdate}>` : 'None'}
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
      **Star Embeds:** ${starboard
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
      .setTimestamp()

    return message.channel.send(embed)
  }
}
