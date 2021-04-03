const { stripIndents } = require('common-tags')
const { Command } = require('discord-akairo')
const { MessageEmbed } = require('discord.js')
const { toColonNotation } = require('colon-notation')

module.exports = class CommandSettings extends Command {
  constructor () {
    super('settings', {
      aliases: ['settings'],
      category: '⚙ Settings',
      description: {
        text: 'View the current settings for this server.'
      },
      clientPermissions: ['EMBED_LINKS'],
      userPermissions: ['MANAGE_GUILD']
    })
  }

  async exec (message) {
    const djRole = await this.client.djRole.get(message.guild.id)
    const djMode = await this.client.djMode.get(message.guild.id)
    const maxTime = await this.client.maxTime.get(message.guild.id)
    const maxQueueLimit = await this.client.maxQueueLimit.get(message.guild.id)
    const nowPlayingAlerts = await this.client.nowPlayingAlerts.get(message.guild.id)
    const allowFilters = await this.client.allowFilters.get(message.guild.id)
    const allowFreeVolume = await this.client.allowFreeVolume.get(message.guild.id)

    const embed = new MessageEmbed()
      .setColor(process.env.COLOR_BLOOD)
      .setAuthor(`Music Settings for ${message.guild.name}`, message.guild.iconURL({ dynamic: true }))
      .setDescription(stripIndents`
      **⁉ Server Prefix:** \`${this.client.prefix.getPrefix(message.guild.id) || process.env.PREFIX}\`
      **🔖 DJ Role:** ${djRole ? `<@&${djRole}>` : 'None'}
      **🎤 DJ Mode:** ${djMode === true ? 'On' : 'Off'}
      **⏲ Max Song Time:** ${maxTime !== (null || undefined) ? toColonNotation(maxTime) : 'Unlimited'}
      **🔢 Max Entries in the Queue:** ${maxQueueLimit || 'Unlimited'}
      **📣 Now Playing Alerts:** ${nowPlayingAlerts === true ? 'On' : 'Off'}
      **📢 Allow Filters:** ${allowFilters === 'dj' ? 'DJ Only' : 'All'}
      **🔊 Unlimited Volume:** ${allowFreeVolume === true ? 'On' : 'Off'}
      `)
      .setTimestamp()

    return message.channel.send(embed)
  }
}
