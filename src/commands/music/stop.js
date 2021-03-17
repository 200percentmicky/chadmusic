const { Command } = require('discord-akairo')
const { stop } = require('../../aliases.json')

module.exports = class CommandStop extends Command {
  constructor () {
    super(stop !== undefined ? stop[0] : 'stop', {
      aliases: stop || ['stop'],
      category: '🎶 Player',
      description: {
        text: 'Stops the player, and clears the queue.'
      },
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS']
    })
  }

  async exec (message) {
    const djMode = await this.client.djMode.get(message.guild.id)
    const djRole = await this.client.djRole.get(message.guild.id)
    const dj = message.member.roles.cache.has(djRole) || message.channel.permissionsFor(message.member.user.id).has(['MANAGE_CHANNELS'])
    if (djMode) {
      if (!dj) return message.say('no', 'DJ Mode is currently active. You must have the DJ Role or the **Manage Channels** permission to use music commands at this time.', 'DJ Mode')
    }

    const vc = message.member.voice.channel
    if (!vc) return message.say('error', 'You are not in a voice channel.')

    const currentVc = this.client.voice.connections.get(message.guild.id)
    if (!this.client.player.isPlaying(message) || !currentVc) return message.say('warn', 'Nothing is currently playing in this server.')
    else if (vc.id !== currentVc.channel.id) return message.say('error', 'You must be in the same voice channel that I\'m in to use that command.')

    if (currentVc.channel.members.size <= 2 || dj) {
      this.client.player.stop(message)
      message.member.voice.channel.leave()
      return message.say('ok', 'Stopped the player and cleared the queue. ⏹')
    } else {
      return message.say('error', 'You must have the DJ role on this server, or the **Manage Channel** permission to use that command. Being alone with me works too!')
    }
  }
}
