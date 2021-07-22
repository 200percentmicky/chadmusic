const { Command } = require('discord-akairo')

module.exports = class CommandDisconnect extends Command {
  constructor () {
    super('disconnect', {
      aliases: ['disconnect', 'leave', 'pissoff', 'fuckoff'],
      category: '🎶 Music',
      description: {
        text: 'Disconnects from the current voice channel.'
      },
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS']
    })
  }

  async exec (message) {
    const djMode = this.client.settings.get(message.guild.id, 'djMode')
    const djRole = this.client.settings.get(message.guild.id, 'djRole')
    const dj = message.member.roles.cache.has(djRole) || message.channel.permissionsFor(message.member.user.id).has(['MANAGE_CHANNELS'])
    if (djMode) {
      if (!dj) {
        return message.say('no', 'DJ Mode is currently active. You must have the DJ Role or the **Manage Channels** permission to use music commands at this time.', 'DJ Mode')
      }
    }

    const currentVc = this.client.voice.connections.get(message.guild.id)
    if (!currentVc) {
      return message.say('error', 'I\'m not in any voice channel.')
    }

    if (currentVc.channel.members.size <= 2 || dj) {
      const vc = message.member.voice.channel
      if (!vc) {
        return message.say('error', 'You are not in a voice channel.')
      } else if (vc.id !== currentVc.channel.id) {
        return message.say('error', 'You must be in the same voice channel that I\'m in to use that command.')
      }

      if (this.client.player.getQueue(message)) {
        this.client.player.stop(message)
      }
      vc.leave()
      return message.custom('📤', 0xDD2E44, `Left <#${vc.id}>`)
    } else {
      return message.say('error', 'You must have the DJ role on this server, or the **Manage Channel** permission to use that command. Being alone with me works too!')
    }
  }
}
