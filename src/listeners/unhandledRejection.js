const { Listener } = require('discord-akairo')

module.exports = class ListenerProcessUnhandledRejection extends Listener {
  constructor () {
    super('unhandledRejection', {
      emitter: 'process',
      event: 'unhandledRejection'
    })
  }

  async exec (error) {
    if (error.name === 'DiscordAPIError') return // Discord API Errors should never be unhandled.
    this.client.logger.error(error)
  }
}
