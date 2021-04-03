const { Command } = require('discord-akairo')

module.exports = class CommandFilterOff extends Command {
  constructor () {
    super('filteroff', {
      aliases: ['filteroff', 'filtersoff', 'foff'],
      category: '📢 Filter',
      description: {
        text: 'Removes all filters from the player.'
      },
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS']
    })
  }

  async exec (message) {
    const djMode = await this.client.djMode.get(message.guild.id)
    const djRole = await this.client.djRole.get(message.guild.id)
    const allowFilters = await this.client.allowFilters.get(message.guild.id)
    const dj = message.member.roles.cache.has(djRole) || message.channel.permissionsFor(message.member.user.id).has(['MANAGE_CHANNELS'])

    if (djMode) {
      if (!dj) return message.say('no', 'DJ Mode is currently active. You must have the DJ Role or the **Manage Channels** permission to use music commands at this time.')
    }

    if (allowFilters === 'dj') {
      if (!dj) {
        return message.say('no', 'You must have the DJ Role or the **Manage Channels** permission to use filters.')
      }
    }

    const vc = message.member.voice.channel
    if (!vc) return message.say('error', 'You are not in a voice channel.')

    const queue = this.client.player.getQueue(message.guild.id)
    if (!queue) return message.say('warn', 'Nothing is currently playing on this server.')

    const currentVc = this.client.voice.connections.get(message.guild.id)
    if (currentVc) {
      if (!queue.filter) return message.say('warn', 'No filters are currently applied to the player.')
      await this.client.player.setFilter(message.guild.id, 'off')
      return message.say('info', 'Removed all filters from the player.')
    } else {
      if (vc.id !== currentVc.channel.id) return message.say('error', 'You must be in the same voice channel that I\'m in to use that command.')
    }
  }
}
