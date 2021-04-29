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
      category: '🎶 Player'
    })
  }

  async exec (message) {
    const args = message.content.split(/ +/g)
    const player = this.client.player
    const queue = player.getQueue(message)

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
  }
}
