const { stripIndents } = require('common-tags')
const { Command } = require('discord-akairo')
const { MessageEmbed } = require('discord.js')

module.exports = class CommandNowPlaying extends Command {
  constructor () {
    super('nowplaying', {
      aliases: ['nowplaying', 'now', 'np'],
      category: '🎶 Player',
      description: {
        text: 'Shows the currently playing song.'
      },
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS']
    })
  }

  async exec (message) {
    const settings = this.client.settings.get(message.guild.id)
    const dj = message.member.roles.cache.has(settings.djRole) || message.member.hasPermission(['MANAGE_CHANNELS'])
    if (settings.djMode) {
      if (!dj) return message.say('no', 'DJ Mode is currently active. You must have the DJ Role or the **Manage Channels** permission to use music commands at this time.', 'DJ Mode')
    }

    const vc = message.member.voice.channel
    if (!vc) return message.say('error', 'You are not in a voice channel.')

    const currentVc = this.client.voice.connections.get(message.guild.id)
    if (!this.client.player.isPlaying(message) || !currentVc) return message.say('warn', 'Nothing is currently playing in this server.')
    else if (vc.id !== currentVc.channel.id) return message.say('error', 'You must be in the same voice channel that I\'m in to use that command.')

    const queue = this.client.player.getQueue(message)
    const song = queue.songs[0]
    return message.channel.send(new MessageEmbed()
      .setColor(this.client.utils.randColor())
      .setAuthor(`Currently playing in ${currentVc.channel.name}`, message.guild.iconURL({ dynamic: true }))
      .setDescription(stripIndents`
      **Requested by:** ${song.user}
      **Duration:** \`${song.formattedDuration}\`
      **Volume:** \`${song.volume}\`
      **Current Filter:** ${queue.filter != null ? queue.filter : 'None'}
      `)
      .setTitle(song.name)
      .setURL(song.url)
      .setThumbnail(song.thumbnail)
      .setTimestamp()
    )
  }
}
