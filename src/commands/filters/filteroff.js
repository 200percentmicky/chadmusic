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
    const djMode = this.client.settings.get(message.guild.id, 'djMode')
    const djRole = this.client.settings.get(message.guild.id, 'djRole')
    const allowFilters = this.client.settings.get(message.guild.id, 'allowFilters')
    const dj = message.member.roles.cache.has(djRole) || message.channel.permissionsFor(message.member.user.id).has(['MANAGE_CHANNELS'])

    if (djMode) {
      if (!dj) return this.client.ui.say(message, 'no', 'DJ Mode is currently active. You must have the DJ Role or the **Manage Channels** permission to use music commands at this time.')
    }

    if (allowFilters === 'dj') {
      if (!dj) {
        return this.client.ui.say(message, 'no', 'You must have the DJ Role or the **Manage Channels** permission to use filters.')
      }
    }

    const vc = message.member.voice.channel
    if (!vc) return this.client.ui.reply(message, 'error', 'You are not in a voice channel.')

    const queue = this.client.player.getQueue(message.guild.id)
    if (!queue) return this.client.ui.say(message, 'warn', 'Nothing is currently playing on this server.')

    const currentVc = this.client.vc.get(vc)
    if (currentVc) {
      if (!queue.filters) return this.client.ui.reply(message, 'error', 'No filters are currently applied to the player.')
      await this.client.player.setFilter(message.guild.id, false)
      return this.client.ui.say(message, 'info', 'Removed all filters from the player.')
    } else {
      if (vc.id !== currentVc.channel.id) return this.client.ui.reply(message, 'error', 'You must be in the same voice channel that I\'m in to use that command.')
    }
  }
}
