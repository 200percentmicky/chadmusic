const { Listener } = require('discord-akairo')

module.exports = class ListenerClientFinishSong extends Listener {
  constructor () {
    super('finishSong', {
      emitter: 'player',
      event: 'finishSong'
    })
  }

  async exec (queue, song) {
    if (queue.repeatMode > 0) {
      // Temporary fix for repeat mode.
      await this.client.player.play(queue.textChannel.guild, song.url)
    }
  }
}
