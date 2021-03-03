const { Command } = require('discord-akairo')

module.exports = class CommandDisconnect extends Command {
  constructor () {
    super('disconnect', {
      aliases: ['disconnect', 'leave'],
      category: '🎶 Player',
      description: {
        text: 'Disconnects from the current voice channel.'
      },
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS']
    })
  }

  async exec (message) {
    const settings = this.client.settings.get(message.guild.id)
    const dj = message.member.roles.cache.has(settings.djRole) || message.channel.permissionsFor(message.member.user.id).has(['MANAGE_CHANNELS'])
    if (settings.djMode) {
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

      const permissions = vc.permissionsFor(this.client.user.id).has(['CONNECT'])
      if (!permissions) {
        return message.say('no', `Missing **Connect** permission for \`${vc.name}\``)
      }

      if (this.client.player.isPlaying(message)) {
        this.client.player.stop(message)
      }
      vc.leave()
      return message.custom('📤', 0xDD2E44, `Left \`${vc.name}\``)
    } else {
      return message.say('error', 'You must have the DJ role on this server, or the **Manage Channel** permission to use that command. Being alone with me works too!')
    }
  }
}
