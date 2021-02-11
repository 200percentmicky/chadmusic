const { Command } = require('discord-akairo')
const { repeat } = require('../../aliases.json')

module.exports = class CommandRepeat extends Command {
  constructor () {
    super(repeat !== undefined ? repeat[0] : 'repeat', {
      aliases: repeat || ['repeat'],
      description: {
        text: 'Toggles repeat mode for the player.',
        usage: '[mode:int]',
        details: '`[mode:int]` The mode to apply for repeat mode.\n\n0 = Off\n1 = Loop Song\n2 = Loop Queue'
      },
      category: '🎶 Player'
    })
  }

  async exec (message) {
    const args = message.content.split(/ +/g)
    const player = this.client.player

    if (!args[1]) return message.usage(`${repeat !== undefined ? repeat[0] : 'repeat'} <mode:int>`)

    const repeatNumbers = {
      0: 'Off',
      1: 'Repeat Song',
      2: 'Repeat Queue'
    }

    await player.setRepeatMode(message, args[1])
    return message.say('ok', `Enabled repeat mode to **${repeatNumbers[args[1]]}**`)
  }
}
