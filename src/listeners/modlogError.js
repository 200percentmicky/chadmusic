const { Listener } = require('discord-akairo')

module.exports = class ListenerModlogError extends Listener {
  constructor () {
    super('modlogError', {
      emitter: 'modlog',
      event: 'error'
    })
  }

  async exec (error) {
    this.client.logger.info('[quickmongo] [modlog] Error: %s', error)
  }
}
