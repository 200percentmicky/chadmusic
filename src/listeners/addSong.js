const { Listener } = require('discord-akairo')
const { Permissions } = require('discord.js')
const prettyms = require('pretty-ms')

module.exports = class ListenerAddSong extends Listener {
  constructor () {
    super('addSong', {
      emitter: 'player',
      event: 'addSong'
    })
  }

  async exec (queue, song) {
    const channel = queue.textChannel
    const message = channel.messages.cache.find(msg => msg)
    const guild = channel.guild
    const member = guild.members.cache.get(queue.songs[queue.songs.length - 1].user.id)

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

    this.client.ui.say(message, 'ok', `Added **${song.name}** to the queue.`)
  }
}
