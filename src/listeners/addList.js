const { Listener } = require('discord-akairo')

module.exports = class ListenerAddList extends Listener {
  constructor () {
    super('addList', {
      emitter: 'player',
      event: 'addList'
    })
  }

  async exec (message, queue, playlist) {
    message.say('ok', `Playlist **${playlist.name}** with **${playlist.songs.length}** entr${playlist.songs.length === 1 ? 'y' : 'ies'} has been added to the queue.`)
  }
}
