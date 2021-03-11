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
    const settings = this.client.settings.get(message.guild.id)
    const embed = new MessageEmbed()
      .setColor(this.client.color.blood)
      .setAuthor(`Music Settings for ${message.guild.name}`, message.guild.iconURL({ dynamic: true }))
      .setDescription(stripIndents`
      **❗ Server Prefix:** \`${this.client.prefix.getPrefix(message.guild.id) || this.client.config.prefix}\`
      **🔖 DJ Role:** ${settings.djRole ? `<@&${settings.djRole}>` : 'None'}
      **🎤 DJ Mode:** ${settings.djMode === true ? 'On' : 'Off'}
      **⏲ Max Song Time:** ${settings.maxTime ? prettyMilliseconds(settings.maxTime, { colonNotation: true }) : 'Unlimited'}
      **🔢 Max Entries in the Queue:** ${settings.maxQueueLimit ? settings.maxQueueLimit : 'Unlimited'}
      **📣 Now Playing Alerts:** ${settings.nowPlayingAlerts === true ? 'On' : 'Off'}
      **🔊 Unlimited Volume:** ${settings.allowFreeVolume === true ? 'On' : 'Off'}
      `)
      .setTimestamp()

    return message.channel.send(embed)
  }
}
