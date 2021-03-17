const { Listener } = require('discord-akairo')

module.exports = class ListenerPlayList extends Listener {
  constructor () {
    super('playList', {
      emitter: 'player',
      event: 'playList'
    })
  }

  async exec (message, queue, playlist) {
    message.say('ok', `Added the playlist **${playlist.name}** with **${playlist.songs.length}** entr${playlist.songs.length === 1 ? 'y' : 'ies'} to the queue.`)
  }
}
