const { Listener } = require('discord-akairo')
const { MessageEmbed } = require('discord.js')
const prettyms = require('pretty-ms')

module.exports = class ListenerPlaySong extends Listener {
  constructor () {
    super('playSong', {
      emitter: 'player',
      event: 'playSong'
    })
  }

  async exec (message, queue, song) {
    if (queue.songs.length === 1) { // If someone started a new queue.
      const settings = this.client.settings.get(message.guild.id)
      const dj = message.member.roles.cache.has(settings.djRole) || message.member.hasPermission(['MANAGE_CHANNELS'])
      if (settings.maxTime) {
        if (!dj) {
          if (parseInt(song.duration + '000') > settings.maxTime) { // DisTube omits the last three digits in the songs duration.
            // Stupid fix.
            if (message.content.includes(this.client.prefix.getPrefix(message.guild.id) + 'skip') || message.content.includes(this.client.prefix.getPrefix(message.guild.id) + 's')) return
            this.client.player.stop(message)
            return message.forbidden(`You cannot add this song to the queue since the duration of this song exceeds the max limit of \`${prettyms(settings.maxTime, { colonNotation: true })}\` for this server.`)
          }
        }
      }
    }
    const textChannel = queue.initMessage.channel // Because message sometimes returns 'undefined'.
    const channel = queue.connection.channel // Same.
    const guild = channel.guild // This as well...
    textChannel.send(new MessageEmbed()
      .setColor(this.client.utils.randColor())
      .setAuthor(`🎵 Now playing in ${guild.name} - ${channel.name}`, guild.iconURL({ dynamic: true }))
      .setTitle(song.name)
      .setURL(song.url)
      .setThumbnail(song.thumbnail)
      .addField('Duration', song.formattedDuration, true)
      .addField('Requested by', song.user, true)
      .setTimestamp()
    )
  }
}
