const { Listener } = require('discord-akairo')

module.exports = class ListenerDebug extends Listener {
  constructor () {
    super('debug', {
      emitter: 'client',
      event: 'debug'
    })
  }

  async exec (debug) {
    if (process.env.NODE_ENV === 'production') return
    this.client.logger.info(debug)
  }
}
