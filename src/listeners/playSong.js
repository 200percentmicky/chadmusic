const { Listener } = require('discord-akairo')
const { MessageEmbed, Permissions } = require('discord.js')
const prettyms = require('pretty-ms')
const iheart = require('iheart')

const isAttachment = (url) => {
  // ! TODO: Come up with a better regex lol
  // eslint-disable-next-line no-useless-escape
  const urlPattern = /https?:\/\/(cdn\.)?(discordapp)\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/g
  const urlRegex = new RegExp(urlPattern)
  return url.match(urlRegex)
}

module.exports = class ListenerPlaySong extends Listener {
  constructor () {
    super('playSong', {
      emitter: 'player',
      event: 'playSong'
    })
  }

  async exec (queue, song) {
    const channel = queue.textChannel // TextChannel
    const guild = channel.guild // Guild
    const member = guild.members.cache.get(queue.songs[queue.songs.length - 1].user.id) // GuildMember
    const prefix = this.client.settings.get(channel.guild.id, 'prefix', process.env.PREFIX)

    // This is annoying.
    const message = channel.messages.cache.filter(x => x.author.id === member.user.id && (x.content.startsWith(prefix) || x.content.startsWith(`<@!${this.client.user.id}>`))).last() // Message
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

    if (this.client.radio.get(guild.id) && !song.author.name) { // Assuming its a radio station.
      // Changes the description of the track, in case its a
      // radio station.
      const search = await iheart.search(`${await this.client.radio.get(guild.id)}`)
      const station = search.stations[0]
      song.name = `${station.name} - ${station.description}`
      song.isLive = true
      song.thumbnail = station.logo || station.newlogo
      song.station = `${station.frequency} ${station.band} - ${station.callLetters} ${station.city}, ${station.state}`
    }

    // Stupid fix to make sure that the queue doesn't break.
    // TODO: Fix toColonNotation in queue.js
    if (song.isLive) song.duration = 1

    const author = song.uploader // Video Uploader

    const songNow = new MessageEmbed()
      .setColor(message.guild.me.displayColor !== 0 ? message.guild.me.displayColor : null)
      .setAuthor(`Now playing in ${vc.name}`, guild.iconURL({ dynamic: true }))

    if (song.age_restricted) songNow.addField('Explicit', '🔞 This track is **Age Restricted**') // Always 'false'. Must be a bug in ytdl-core.
    if (isAttachment(song.url)) songNow.setDescription('📎 **File Upload**')
    if (author.name) songNow.addField('Uploader', `[${author.name}](${author.url})` || 'N/A')
    if (song.station) songNow.addField('Station', `${song.station}`)

    songNow
      .addField('Requested by', `${song.user}`, true)
      .addField('Duration', `${song.isLive ? '🔴 **Live**' : song.duration > 0 ? song.formattedDuration : 'N/A'}`, true)
      .setTitle(`${song.name}`)
      .setURL(song.url)
      .setThumbnail(song.thumbnail)
      .setTimestamp()

    if (isAttachment(song.url)) {
      const supportedFormats = [
        'mp3',
        'mp4',
        'webm',
        'ogg',
        'wav'
      ]
      // This is to prevent the event from being called. This is already
      // checked in the 'addSong' event.
      if (!supportedFormats.some(element => song.url.endsWith(element))) {
        return
      }
    }

    if (!message.channel) {
      channel.send({ embeds: [songNow] })
    } else {
      message.channel.send({ embeds: [songNow] })
    }
  }
}
