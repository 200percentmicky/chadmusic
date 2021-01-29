const { Listener } = require('discord-akairo')

module.exports = class ListenerClientError extends Listener {
  constructor () {
    super('clientError', {
      emitter: 'client',
      event: 'error'
    })
  }

  async exec (error) {
    this.client.logger.error(error)
  }
}
