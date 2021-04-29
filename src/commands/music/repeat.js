const { Command } = require('discord-akairo')

module.exports = class CommandRepeat extends Command {
  constructor () {
    super('repeat', {
      aliases: ['repeat'],
      description: {
        text: 'Toggles repeat mode for the player.',
        usage: '[mode]',
        details: '`[mode]` The mode to apply for repeat mode.\n\nOff or 0\n1 = Loop Song\n2 = Loop Queue'
      },
      category: '🎶 Player'
    })
  }

  async exec (message) {
    const args = message.content.split(/ +/g)
    const player = this.client.player

    switch (args[1]) {
      case 'off' || 0: {
        await player.setRepeatMode(message, 0)
        message.say('ok', 'Repeat has been disabled.')
        break
      }
      case 'song' || 1: {
        await player.setRepeatMode(message, 1)
        message.say('ok', 'Enabled repeat to **🔂 Repeat Song**')
        break
      }
      case 'queue' || 2: {
        await player.setRepeatMode(message, 2)
        message.say('ok', 'Enabled repeat to **🔁 Repeat Queue**')
        break
      }
      default: {
        if (player.repeatMode !== 0) {
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
