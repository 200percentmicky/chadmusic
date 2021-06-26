const { Command } = require('discord-akairo')

module.exports = class CommandStop extends Command {
  constructor () {
    super('remove', {
      aliases: ['remove', 'removesong'],
      category: '🎶 Music',
      description: {
        text: 'Removes an entry from the queue.',
        usage: '<int:queue_entry>',
        details: '`<int:queue_entry>` The queue entry to remove from the queue.'
      },
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS']
    })
  }

  async exec (message) {
    const args = message.content.split(/ +/g)
    const djMode = this.client.settings.get(message.guild.id, 'djMode')
    const djRole = this.client.settings.get(message.guild.id, 'djRole')
    const dj = message.member.roles.cache.has(djRole) || message.channel.permissionsFor(message.member.user.id).has(['MANAGE_CHANNELS'])
    if (djMode) {
      if (!dj) return message.say('no', 'DJ Mode is currently active. You must have the DJ Role or the **Manage Channels** permission to use music commands at this time.', 'DJ Mode')
    }

    const vc = message.member.voice.channel
    if (!vc) return message.say('error', 'You are not in a voice channel.')

    const currentVc = this.client.voice.connections.get(message.guild.id)
    if (!this.client.player.isPlaying(message) || !currentVc) return message.say('warn', 'Nothing is currently playing in this server.')
    else if (vc.id !== currentVc.channel.id) return message.say('error', 'You must be in the same voice channel that I\'m in to use that command.')

    if (!args[1]) return message.usage('remove <int:queue_entry>')

    if (currentVc.channel.members.size <= 2 || dj) {
      const queue = this.client.player.getQueue(message)
      const song = queue.songs[args[1]]
      queue.songs.splice(args[1], 1)
      return message.say('ok', `Removed **${song.name}** from the queue.`)
    } else {
      return message.say('error', 'You must have the DJ role on this server, or the **Manage Channel** permission to use that command. Being alone with me works too!')
    }
  }
}
