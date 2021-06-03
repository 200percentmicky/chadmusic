const { Listener } = require('discord-akairo')

module.exports = class ListenerModlogReady extends Listener {
  constructor () {
    super('modlogReady', {
      emitter: 'modlog',
      event: 'ready'
    })
  }

  async exec (ready) {
    this.client.logger.info('[quickmongo] [modlog] Connection has been established!')
  }
}
