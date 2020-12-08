const { Command } = require('discord-akairo')

module.exports = class CommandNightcore extends Command {
  constructor () {
    super('nightcore', {
      aliases: ['nightcore'],
      category: '🗣 Filter',
      description: {
        text: 'Nightcore, Limp Bizkit style!',
        filter: 'asetrate=48000*1.25,aresample=48000,bass=g=5'
      },
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS']
    })
  }

  async exec (message) {
    const settings = this.client.settings.get(message.guild.id)
    const dj = message.member.roles.cache.has(settings.djRole) || message.member.hasPermission(['MANAGE_CHANNELS'])
    if (settings.djMode) {
      if (!dj) return message.forbidden('DJ Mode is currently active. You must have the DJ Role or the **Manage Channels** permission to use music commands at this time.')
    }

    const vc = message.member.voice.channel
    if (!vc) return message.error('You are not in a voice channel.')

    const queue = this.client.player.getQueue(message.guild.id)
    if (!queue) return message.warn('Nothing is currently playing on this server.')

    const currentVc = this.client.voice.connections.get(message.guild.id)
    if (currentVc) {
      await this.client.player.setFilter(message.guild.id, 'nightcore')
      return message.ok('Applied filter: **Nightcore!**')
    } else {
      if (vc.id !== currentVc.channel.id) return message.error('You must be in the same voice channel that I\'m in to use that command.')
    }
  }
}
