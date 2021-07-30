const { Listener } = require('discord-akairo')

module.exports = class ListenerAddList extends Listener {
  constructor () {
    super('addList', {
      emitter: 'player',
      event: 'addList'
    })
  }

  async exec (queue, playlist) {
    const channel = queue.textChannel
    const message = channel.messages.cache.find(msg => msg)
    this.client.ui.say(message, 'ok', `Added the playlist **${playlist.name}** with **${playlist.songs.length}** entr${playlist.songs.length === 1 ? 'y' : 'ies'} to the queue.`)
  }
}
