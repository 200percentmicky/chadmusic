const { Listener } = require('discord-akairo')
const { Permissions } = require('discord.js')
const prettyms = require('pretty-ms')

const isAttachment = (url) => {
  // ! TODO: Come up with a better regex lol
  // eslint-disable-next-line no-useless-escape
  const urlPattern = /https?:\/\/(cdn\.)?(discordapp)\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/g
  const urlRegex = new RegExp(urlPattern)
  return url.match(urlRegex)
}

module.exports = class ListenerAddSong extends Listener {
  constructor () {
    super('addSong', {
      emitter: 'player',
      event: 'addSong'
    })
  }

  async exec (queue, song) {
    const channel = queue.textChannel
    const guild = channel.guild
    const member = guild.members.cache.get(queue.songs[queue.songs.length - 1].user.id)
    const prefix = this.client.settings.get(channel.guild.id, 'prefix', process.env.PREFIX)
    const message = channel.messages.cache.filter(x => x.author.id === member.user.id && x.content.startsWith(prefix)).last()

    const djRole = await this.client.settings.get(guild.id, 'djRole')
    const allowAgeRestricted = await this.client.settings.get(guild.id, 'allowAgeRestricted', true)
    const maxTime = await this.client.settings.get(guild.id, 'maxTime')
    const dj = member.roles.cache.has(djRole) || channel.permissionsFor(member.user.id).has(Permissions.FLAGS.MANAGE_CHANNELS)
    if (!allowAgeRestricted) {
      queue.songs.pop()
      return this.client.ui.say(message, 'no', 'You cannot add **Age Restricted** videos to the queue.')
    }
    if (maxTime) {
      if (!dj) {
        // DisTube provide the duration as a decimal.
        // Using Math.floor() to round down.
        // Still need to apend '000' to be accurate.
        if (parseInt(Math.floor(song.duration + '000')) > maxTime) {
          queue.songs.pop()
          return this.client.ui.say(message, 'no', `You cannot add this song to the queue since the duration of this song exceeds the max limit of \`${prettyms(maxTime, { colonNotation: true })}\` for this server.`)
        }
      }
    }

    if (isAttachment(song.url)) {
      const supportedFormats = [
        'mp3',
        'mp4',
        'webm',
        'ogg',
        'wav'
      ]
      if (!supportedFormats.some(element => song.url.endsWith(element))) {
        queue.songs.pop()
        return this.client.ui.say(message, 'error', `The attachment is invalid. Supported formats: ${supportedFormats.map(x => `\`${x}\``).join(', ')}`)
      }
    }

    this.client.ui.say(message, 'ok', `Added **${song.name}** to the queue.`)
  }
}
