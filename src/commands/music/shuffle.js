const { Command } = require('discord-akairo')
const { shuffle } = require('../../aliases.json')

module.exports = class CommandShuffle extends Command {
  constructor () {
    super(shuffle !== undefined ? shuffle[0] : 'shuffle', {
      aliases: shuffle || ['shuffle'],
      category: '🎶 Player',
      description: {
        text: 'Randomizes the entries in the queue.'
      },
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS']
    })
  }

  async exec (message) {
    const djMode = await this.client.djMode.get(message.guild.id)
    const djRole = await this.client.djRole.get(message.guild.id)
    const dj = message.member.roles.cache.has(djRole) || message.channel.permissionsFor(message.member.user.id).has(['MANAGE_CHANNELS'])
    if (djMode) {
      if (!dj) return message.say('no', 'DJ Mode is currently active. You must have the DJ Role or the **Manage Channels** permission to use music commands at this time.', 'DJ Mode')
    }

    const vc = message.member.voice.channel
    if (!vc) return message.say('error', 'You are not in a voice channel.')

    const currentVc = this.client.voice.connections.get(message.guild.id)
    if (currentVc.channel.members.size <= 2 || dj) {
      if (vc.id !== currentVc.channel.id) return message.say('error', 'You must be in the same voice channel that I\'m in to use that command.')

      const permissions = vc.permissionsFor(this.client.user.id).has(['CONNECT'])
      if (!permissions) return message.say('no', `Missing **Connect** permission for \`${vc.name}\``)

      const queue = this.client.player.getQueue(message)
      if (!queue) return message.say('warn', 'Nothing is currently playing in this server.')
      this.client.player.shuffle(message)
      return message.say('ok', `**${queue.songs.length - 1}** entries have been shuffled.`)
    } else {
      return message.say('error', 'You must have the DJ role on this server, or the **Manage Channel** permission to use that command. Being alone with me works too!')
    }
  }
}
