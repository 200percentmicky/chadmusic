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
    const msg = queue.initMessage // message sometimes returns 'undefined'
    const textChannel = msg.channel // Again, message sometimes returns 'undefined'.
    const channel = queue.connection.channel // Same.
    const guild = channel.guild // This as well...
    // This be some weird shit above...

    if (queue.songs.length === 1) { // If someone started a new queue.
      const djRole = await this.client.settings.get(message.guild.id, 'djRole')
      const maxTime = await this.client.settings.get(message.guild.id, 'maxTime')
      const dj = msg.member.roles.cache.has(djRole) || channel.permissionsFor(msg.member.user.id).has(['MANAGE_CHANNELS'])
      if (maxTime) {
        if (!dj) {
          if (parseInt(song.duration + '000') > maxTime) { // DisTube omits the last three digits in the songs duration.
            // Stupid fix.
            if (msg.content.includes(this.client.prefix.getPrefix(guild.id) + ('skip' || 's'))) return
            this.client.player.stop(message)
            return msg.say('no', `You cannot add this song to the queue since the duration of this song exceeds the max limit of \`${prettyms(maxTime, { colonNotation: true })}\` for this server.`)
          }
        }
      }
    }

    const songNow = new MessageEmbed()
      .setColor(this.client.utils.randColor())
      .setAuthor(`Now playing in ${channel.name}`, guild.iconURL({ dynamic: true }))
      .addField('Requested by', `${song.user}`, true)
      .addField('Duration', `${song.formattedDuration === '00:00' ? 'Live' : song.formattedDuration}`, true)
      .setTitle(`${song.name}`)
      .setURL(song.url)
      .setThumbnail(song.thumbnail)
      .setTimestamp()

    if (!message.channel) {
      textChannel.send({ embeds: [songNow] })
    } else {
      message.channel.send({ embeds: [songNow] })
    }
  }
}
