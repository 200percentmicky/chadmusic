const { Listener } = require('discord-akairo')

module.exports = class ListenerInitQueue extends Listener {
  constructor () {
    super('initQueue', {
      emitter: 'player',
      event: 'initQueue'
    })
  }

  async exec (queue) {
    const guild = queue.textChannel.guild
    queue.autoplay = false
    queue.volume = parseInt(this.client.settings.get(guild.id, 'defaultVolume', 100))
  }
}
