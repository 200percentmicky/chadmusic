const { Command } = require('discord-akairo')
const { toMilliseconds } = require('colon-notation')

module.exports = class CommandSeek extends Command {
  constructor () {
    super('seek', {
      aliases: ['seek'],
      description: {
        text: 'Sets the playing time of the track to a new position.',
        usage: '<time>',
        details: '`<time>` The time of the track to seek to.'
      },
      category: '🎶 Music'
    })
  }

  async exec (message) {
    const djMode = this.client.settings.get(message.guild.id, 'djMode')
    const djRole = this.client.settings.get(message.guild.id, 'djRole')
    const dj = message.member.roles.cache.has(djRole) || message.channel.permissionsFor(message.member.user.id).has(['MANAGE_CHANNELS'])
    if (djMode) {
      if (!dj) return message.say('no', 'DJ Mode is currently active. You must have the DJ Role or the **Manage Channels** permission to use music commands at this time.', 'DJ Mode')
    }

    const args = message.content.split(/ +/g)

    const vc = message.member.voice.channel
    if (!vc) return message.say('error', 'You are not in a voice channel.')

    const currentVc = this.client.voice.connections.get(message.guild.id)

    if (!this.client.player.isPlaying(message) || !currentVc) return message.say('warn', 'Nothing is currently playing in this server.')

    if (currentVc.channel.members.size <= 2 || dj) {
      if (!args[1]) return message.usage('seek <time>')
      const time = toMilliseconds(args[1])
      if (isNaN(time)) {
        return message.say('error', `\`${time}\` is not a valid time interval.`)
      }
      await this.client.player.seek(message, parseInt(time))
      return message.react(process.env.REACTION_OK)
    } else {
      return message.say('error', 'You must have the DJ role on this server, or the **Manage Channel** permission to use that command. Being alone with me works too!')
    }
  }
}
