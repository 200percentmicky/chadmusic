const { Command } = require('discord-akairo')
const { MessageEmbed } = require('discord.js')
const { splitBar } = require('string-progressbar')

const isAttachment = (url) => {
  // ! TODO: Come up with a better regex lol
  // eslint-disable-next-line no-useless-escape
  const urlPattern = /https?:\/\/(cdn\.)?(discordapp)\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/g
  const urlRegex = new RegExp(urlPattern)
  return url.match(urlRegex)
}

module.exports = class CommandNowPlaying extends Command {
  constructor () {
    super('nowplaying', {
      aliases: ['nowplaying', 'np'],
      category: '🎶 Music',
      description: {
        text: 'Shows the currently playing song.'
      },
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS']
    })
  }

  async exec (message) {
    const djMode = this.client.settings.get(message.guild.id, 'djMode')
    const djRole = this.client.settings.get(message.guild.id, 'djRole')
    const dj = message.member.roles.cache.has(djRole) || message.channel.permissionsFor(message.member.user.id).has(['MANAGE_CHANNELS'])
    if (djMode) {
      if (!dj) return this.client.ui.say(message, 'no', 'DJ Mode is currently active. You must have the DJ Role or the **Manage Channels** permission to use music commands at this time.', 'DJ Mode')
    }

    const textChannel = this.client.settings.get(message.guild.id, 'textChannel', null)
    if (textChannel) {
      if (textChannel !== message.channel.id) {
        return this.client.ui.say(message, 'no', `Music commands must be used in <#${textChannel}>.`)
      }
    }

    const vc = message.member.voice.channel
    if (!vc) return this.client.ui.say(message, 'error', 'You are not in a voice channel.')

    const currentVc = this.client.vc.get(vc)
    if (!this.client.player.getQueue(message) || !currentVc) return this.client.ui.say(message, 'warn', 'Nothing is currently playing in this server.')
    else if (vc.id !== currentVc.channel.id) return this.client.ui.say(message, 'error', 'You must be in the same voice channel that I\'m in to use that command.')

    const queue = this.client.player.getQueue(message)

    const song = queue.songs[0]
    const total = song.duration + '000'
    const current = queue.currentTime
    const author = song.uploader

    const progressBar = splitBar(total, current, 17)[0]
    const duration = song.isLive ? '🔴 **Live**' : isAttachment(song.url) ? '📎 **File Upload**' : `${queue.formattedCurrentTime} [${progressBar}] ${song.formattedDuration}`
    const embed = new MessageEmbed()
      .setColor(message.guild.me.displayColor)
      .setAuthor(`Currently playing in ${currentVc.channel.name}`, message.guild.iconURL({ dynamic: true }))
      .setDescription(`${duration}`)
      .setTitle(song.name)
      .setURL(song.url)
      .setThumbnail(song.thumbnail)

    if (queue.paused) {
      const prefix = this.client.settings.get(message.guild.id, 'prefix', process.env.PREFIX)
      embed.addField('⏸ Paused', `Type '${prefix}resume' to resume playback.`)
    }

    if (song.age_restricted) {
      embed.addField('Explicit', '🔞 This track is **Age Restricted**')
    }

    embed
      .addField('Channel', `[${author.name}](${author.url})` || 'N/A')
      .addField('Requested by', `${song.user}`, true)
      .addField('Volume', `${queue.volume}%`, true)
      .addField('📢 Filters', `${queue.filters.length > 0 ? `${queue.filters.map(x => `**${x.name}:** ${x.value}`)}` : 'None'}`)
      .setTimestamp()

    return message.channel.send({ embeds: [embed] })
  }
}
