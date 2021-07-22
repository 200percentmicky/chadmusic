const { Command } = require('discord-akairo')

module.exports = class CommandRepeat extends Command {
  constructor () {
    super('repeat', {
      aliases: ['repeat', 'loop'],
      description: {
        text: 'Toggles repeat mode for the player.',
        usage: '[mode]',
        details: '`[mode]` The mode to apply for repeat mode. Valid options are **off**, **song**, or **queue**. Default is **song**.'
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
    const player = this.client.player
    const queue = player.getQueue(message)

    const vc = message.member.voice.channel
    if (!vc) return message.say('error', 'You are not in a voice channel.')

    const currentVc = this.client.voice.connections.get(message.guild.id)

    if (!this.client.player.getQueue(message) || !currentVc) return message.say('warn', 'Nothing is currently playing in this server.')

    if (currentVc.channel.members.size <= 2 || dj) {
      switch (args[1]) {
        case 'off': {
          await player.setRepeatMode(message, 0)
          message.say('ok', 'Repeat has been disabled.')
          break
        }
        case 'song': {
          await player.setRepeatMode(message, 1)
          message.say('ok', 'Enabled repeat to **🔂 Repeat Song**')
          break
        }
        case 'queue': {
          await player.setRepeatMode(message, 2)
          message.say('ok', 'Enabled repeat to **🔁 Repeat Queue**')
          break
        }
        default: {
          if (queue.repeatMode !== 0) {
            await player.setRepeatMode(message, 0)
            message.say('ok', 'Repeat has been disabled.')
            break
          }
          await player.setRepeatMode(message, 1)
          message.say('ok', 'Enabled repeat to **🔂 Repeat Song**')
          break
        }
      }
    } else {
      return message.say('error', 'You must have the DJ role on this server, or the **Manage Channel** permission to use that command. Being alone with me works too!')
    }
  }
}
