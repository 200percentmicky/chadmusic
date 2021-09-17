const { Listener } = require('discord-akairo')

module.exports = class ListenerClientFinishSong extends Listener {
  constructor () {
    super('finishSong', {
      emitter: 'player',
      event: 'finishSong'
    })
  }

  async exec (queue, song) {
    this.client.logger.info('Song has finished.')
  }
}
