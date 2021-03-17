const { Listener } = require('discord-akairo')

module.exports = class ListenerGuildDelete extends Listener {
  constructor () {
    super('guildDelete', {
      emitter: 'client',
      event: 'guildDelete'
    })
  }

  async exec (guild) {
    return null // I'll deal with this later.
  }
}
