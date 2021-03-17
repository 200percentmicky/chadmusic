const { stripIndents } = require('common-tags')
const { Command } = require('discord-akairo')
const { MessageEmbed } = require('discord.js')
const prettyMilliseconds = require('pretty-ms')

module.exports = class CommandSettings extends Command {
  constructor () {
    super('musicsettings', {
      aliases: ['musicsettings'],
      category: '🔑 Administration',
      description: {
        text: 'View the current settings for this server.'
      }
    })
  }

  async exec (message) {
    const djRole = this.client.djRole.get(message.guild.id)
    const djMode = this.client.djMode.get(message.guild.id)
    const maxTime = this.client.maxTime.get(message.guild.id)
    const maxQueueLimit = this.client.maxQueueLimit.get(message.guild.id)
    const nowPlayingAlerts = this.client.nowPlayingAlerts.get(message.guild.id)
    const allowFreeVolume = this.client.allowFreeVolume.get(message.guild.id)

    const embed = new MessageEmbed()
      .setColor(this.client.color.blood)
      .setAuthor(`Music Settings for ${message.guild.name}`, message.guild.iconURL({ dynamic: true }))
      .setDescription(stripIndents`
      **❗ Server Prefix:** \`${this.client.prefix.getPrefix(message.guild.id) || this.client.config.prefix}\`
      **🔖 DJ Role:** ${djRole ? `<@&${djRole}>` : 'None'}
      **🎤 DJ Mode:** ${djMode === true ? 'On' : 'Off'}
      **⏲ Max Song Time:** ${maxTime ? prettyMilliseconds(maxTime, { colonNotation: true }) : 'Unlimited'}
      **🔢 Max Entries in the Queue:** ${maxQueueLimit || 'Unlimited'}
      **📣 Now Playing Alerts:** ${nowPlayingAlerts === true ? 'On' : 'Off'}
      **🔊 Unlimited Volume:** ${allowFreeVolume === true ? 'On' : 'Off'}
      `)
      .setTimestamp()

    return message.channel.send(embed)
  }
}
