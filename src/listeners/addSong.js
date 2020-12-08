const { Listener } = require('discord-akairo')

module.exports = class ListenerAddSong extends Listener {
  constructor () {
    super('addSong', {
      emitter: 'player',
      event: 'addSong'
    })
  }

  async exec (message, queue, song) {
    message.ok(`Added **${song.name}** to the queue.`)
  }
}
