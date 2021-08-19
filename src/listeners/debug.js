const { Listener } = require('discord-akairo')

module.exports = class ListenerDebug extends Listener {
  constructor () {
    super('debug', {
      emitter: 'client',
      event: 'debug'
    })
  }

  async exec (debug) {
    if (process.env.DEV === 'true') return
    this.client.logger.info(debug)
  }
}
