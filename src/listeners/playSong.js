const { Listener } = require('discord-akairo')
const { MessageEmbed, Permissions } = require('discord.js')
const prettyms = require('pretty-ms')

module.exports = class ListenerPlaySong extends Listener {
  constructor () {
    super('playSong', {
      emitter: 'player',
      event: 'playSong'
    })
  }

  async exec (queue, song) {
    const channel = queue.textChannel // TextChannel
    const message = channel.messages.cache.find(msg => msg) // Message
    const guild = channel.guild // Guild
    const member = guild.members.cache.get(queue.songs[queue.songs.length - 1].user.id) // GuildMember
    const vc = member.voice.channel // VoiceChannel

    if (queue.songs.length === 1) { // If someone started a new queue.
      const djRole = await this.client.settings.get(guild.id, 'djRole')
      const allowAgeRestricted = await this.client.settings.get(guild.id, 'allowAgeRestricted', true)
      const maxTime = await this.client.settings.get(guild.id, 'maxTime')

      // Check if this member is a DJ
      const dj = member.roles.cache.has(djRole) || channel.permissionsFor(member.user.id).has(Permissions.FLAGS.MANAGE_CHANNELS)
      if (!allowAgeRestricted) {
        this.client.player.stop(message)
        return this.client.ui.say(message, 'no', 'You cannot add **Age Restricted** videos to the queue.')
      }
      if (maxTime) {
        if (!dj) {
          // DisTube provide the duration as a decimal.
          // Using Math.floor() to round down.
          // Still need to apend '000' to be accurate.
          if (parseInt(Math.floor(song.duration + '000')) > maxTime) {
            // Stupid fix.
            if (message.content.includes(this.client.prefix.getPrefix(guild.id) + ('skip' || 's'))) return
            this.client.player.stop(message)
            return this.client.ui.say(message, 'no', `You cannot add this song to the queue since the duration of this song exceeds the max limit of \`${prettyms(maxTime, { colonNotation: true })}\` for this server.`)
          }
        }
      }
    }

    const author = song.uploader // Video Uploader

    const songNow = new MessageEmbed()
      .setColor(this.client.utils.randColor())
      .setAuthor(`Now playing in ${vc.name}`, guild.iconURL({ dynamic: true }))

    if (song.age_restricted) songNow.addField('Explicit', '🔞 This track is **Age Restricted**') // Always 'false'. Must be a bug in ytdl-core.

    songNow
      .addField('Channel', `[${author.name}](${author.url})`)
      .addField('Requested by', `${song.user}`, true)
      .addField('Duration', `${song.isLive ? '📡 **Live**' : song.formattedDuration}`, true)
      .setTitle(`${song.name}`)
      .setURL(song.url)
      .setThumbnail(song.thumbnail)
      .setTimestamp()

    if (!message.channel) {
      channel.send({ embeds: [songNow] })
    } else {
      message.channel.send({ embeds: [songNow] })
    }
  }
}
