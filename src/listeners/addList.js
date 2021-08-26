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
    const member = channel.guild.members.cache.get(queue.songs[queue.songs.length - 1].user.id)
    const prefix = this.client.settings.get(channel.guild.id, 'prefix', process.env.PREFIX)
    const message = channel.messages.cache.filter(x => x.author.id === member.user.id && x.content.startsWith(prefix)).last()

    this.client.ui.say(message, 'ok', `Added the playlist **${playlist.name}** with **${playlist.songs.length}** entr${playlist.songs.length === 1 ? 'y' : 'ies'} to the queue.`)
  }
}
