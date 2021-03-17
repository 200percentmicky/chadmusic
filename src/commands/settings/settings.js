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
      },
      clientPermissions: ['EMBED_LINKS']
    })
  }

  async exec (message) {
    const djRole = await this.client.djRole.get(message.guild.id)
    const djMode = await this.client.djMode.get(message.guild.id)
    const maxTime = await this.client.maxTime.get(message.guild.id)
    const maxQueueLimit = await this.client.maxQueueLimit.get(message.guild.id)
    const nowPlayingAlerts = await this.client.nowPlayingAlerts.get(message.guild.id)
    const allowFreeVolume = await this.client.allowFreeVolume.get(message.guild.id)

    const embed = new MessageEmbed()
      .setColor(this.client.color.blood)
      .setAuthor(`Music Settings for ${message.guild.name}`, message.guild.iconURL({ dynamic: true }))
      .setDescription(stripIndents`
      **⁉ Server Prefix:** \`${this.client.prefix.getPrefix(message.guild.id) || this.client.config.prefix}\`
      **🔖 DJ Role:** ${djRole ? `<@&${djRole}>` : 'None'}
      **🎤 DJ Mode:** ${djMode === true ? 'On' : 'Off'}
      **⏲ Max Song Time:** ${maxTime !== undefined ? prettyMilliseconds(maxTime, { colonNotation: true }) : 'Unlimited'}
      **🔢 Max Entries in the Queue:** ${maxQueueLimit || 'Unlimited'}
      **📣 Now Playing Alerts:** ${nowPlayingAlerts === true ? 'On' : 'Off'}
      **🔊 Unlimited Volume:** ${allowFreeVolume === true ? 'On' : 'Off'}
      `)
      .setTimestamp()

    return message.channel.send(embed)
  }
}
