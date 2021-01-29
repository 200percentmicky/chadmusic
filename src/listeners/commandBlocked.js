const { Listener } = require('discord-akairo')

module.exports = class CommandBlockedListener extends Listener {
  constructor () {
    super('commandBlocked', {
      emitter: 'commandHandler',
      event: 'commandBlocked'
    })
  }

  async exec (message, command, reason) {
    if (reason === 'owner') return message.say('no', 'Only the bot owner can execute that command.')
    if (reason === 'guild') return message.say('error', 'That command must be used in a server.')
    if (reason === 'dm') return message.say('error', 'That command must be used in a Direct Message.')
  }
}
