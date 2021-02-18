const { Command } = require('discord-akairo')

module.exports = class CommandCrusher extends Command {
  constructor () {
    super('crusher', {
      aliases: ['crusher'],
      category: '🗣 Filter',
      description: {
        text: 'Adds a bit crusher to the player.',
        usage: '<bits>',
        details: '`<bits>` The number to set the bit reduction to.'
      },
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS']
    })
  }

  async exec (message) {
    const args = message.content.split(/ +/g)
    const settings = this.client.settings.get(message.guild.id)
    const dj = message.member.roles.cache.has(settings.djRole) || message.channel.permissionsFor(message.member.user.id).has(['MANAGE_CHANNELS'])
    if (settings.djMode) {
      if (!dj) return message.say('no', 'DJ Mode is currently active. You must have the DJ Role or the **Manage Channels** permission to use music commands at this time.')
    }

    const vc = message.member.voice.channel
    if (!vc) return message.say('error', 'You are not in a voice channel.')

    const queue = this.client.player.getQueue(message.guild.id)
    if (!queue) return message.say('warn', 'Nothing is currently playing on this server.')

    const currentVc = this.client.voice.connections.get(message.guild.id)
    if (currentVc) {
      const bits = args[1] || 10
      await this.client.player.setFilter(message.guild.id, 'acrusher', args[1] === 'OFF'.toLowerCase() ? 'off' : `acrusher=bits=${bits}`)
      return message.custom('📢', this.client.color.info, `**Crusher** ${args[1] === 'OFF'.toLowerCase() ? 'Off' : `Bits: ${bits}`}`)
    } else {
      if (vc.id !== currentVc.channel.id) return message.say('error', 'You must be in the same voice channel that I\'m in to use that command.')
    }
  }
}
