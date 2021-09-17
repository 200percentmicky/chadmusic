const { Listener } = require('discord-akairo')

module.exports = class ListenerClientFinish extends Listener {
  constructor () {
    super('finish', {
      emitter: 'player',
      event: 'finish'
    })
  }

  async exec (queue) {
    this.client.logger.info('Queue has finished.')
  }
}
