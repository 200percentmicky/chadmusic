const { Listener } = require('discord-akairo')

module.exports = class ListenerDebug extends Listener {
  constructor () {
    super('debug', {
      emitter: 'client',
      event: 'debug'
    })
  }

  async exec (debug) {
    this.client.logger.info(debug)
  }
}
