const { Command } = require('discord-akairo')

module.exports = class CommandReverseQueue extends Command {
  constructor () {
    super('reversequeue', {
      aliases: ['reversequeue', 'rq'],
      category: '🎶 Music',
      description: {
        text: 'Reverses the order of the queue.'
      },
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS']
    })
  }

  async exec (message) {
    const djMode = this.client.settings.get(message.guild.id, 'djMode')
    const djRole = this.client.settings.get(message.guild.id, 'djRole')
    const dj = message.member.roles.cache.has(djRole) || message.channel.permissionsFor(message.member.user.id).has(['MANAGE_CHANNELS'])
    if (djMode) {
      if (!dj) return message.say('no', 'DJ Mode is currently active. You must have the DJ Role or the **Manage Channels** permission to use music commands at this time.', 'DJ Mode')
    }

    const vc = message.member.voice.channel
    if (!vc) return message.say('error', 'You are not in a voice channel.')

    const currentVc = this.client.voice.connections.get(message.guild.id)
    if (!this.client.player.getQueue(message) || !currentVc) return message.say('warn', 'Nothing is currently playing in this server.')
    else if (vc.id !== currentVc.channel.id) return message.say('error', 'You must be in the same voice channel that I\'m in to use that command.')

    if (currentVc.channel.members.size <= 2 || dj) {
      const queue = this.client.player.getQueue(message)

      /* Slice the original queue */
      const queueLength = queue.songs.length
      const newQueue = queue.songs.slice(1, queueLength)

      /* Remove the existing elements in the queue */
      queue.songs.splice(1, queueLength)

      /* Reverse the new queue */
      newQueue.reverse()

      /* Finally, push the new queue into the player's queue. */
      Array.prototype.push.apply(queue.songs, newQueue)

      return message.say('ok', 'The order of the queue has been reversed.')
    } else {
      return message.say('error', 'You must have the DJ role on this server, or the **Manage Channel** permission to use that command. Being alone with me works too!')
    }
  }
}
