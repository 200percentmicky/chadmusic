const { Command } = require('discord-akairo')

module.exports = class CommandSkipTo extends Command {
  constructor () {
    super('skipto', {
      aliases: ['skipto', 'jumpto'],
      category: '🎶 Music',
      description: {
        text: 'Skips to the specified entry in the queue.',
        usage: '<int:queue_entry>',
        details: '`<int:queue_entry>` The number of the queue entry to skip to. Skips all other entries of the queue.'
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
      if (!dj) return this.client.ui.say(message, 'no', 'DJ Mode is currently active. You must have the DJ Role or the **Manage Channels** permission to use music commands at this time.')
    }

    const textChannel = this.client.settings.get(message.guild.id, 'textChannel', null)
    if (textChannel) {
      if (textChannel !== message.channel.id) {
        return this.client.ui.say(message, 'no', `Music commands must be used in <#${textChannel}>.`)
      }
    }

    const vc = message.member.voice.channel
    if (!vc) return this.client.ui.reply(message, 'error', 'You are not in a voice channel.')

    const currentVc = this.client.vc.get(vc)
    if (!this.client.player.getQueue(message) || !currentVc) return this.client.ui.say(message, 'warn', 'Nothing is currently playing in this server.')
    else if (vc.id !== currentVc.channel.id) return this.client.ui.reply(message, 'error', 'You must be in the same voice channel that I\'m in to use that command.')

    // For breaking use only.
    // this.client.player.skip(message)
    // return this.client.ui.say(message, '⏭', process.env.COLOR_INFO, 'Skipped!')

    /*
    if (args[1] === ('--force' || '-f')) {
      if (!dj) return this.client.ui.reply(message, 'error', 'You must have the DJ role or the **Manage Channel** permission to use the `--force` flag.')
      this.client.player.skip(message)
      return this.client.ui.custom(message, '⏭', process.env.COLOR_INFO, 'Skipped!')
    }
    */

    const queue = this.client.player.getQueue(message)
    const song = queue.songs[args[1]]

    if (vc.members.size <= 2) {
      try {
        this.client.player.jump(message, parseInt(args[1]))
        return this.client.ui.custom(message, '⏭', process.env.COLOR_INFO, `Skipped to **${song.name}**`)
      } catch {
        return this.client.ui.reply(message, 'error', 'Not a valid entry in the queue.')
      }
    } else {
      if (dj) {
        try {
          this.client.player.jump(message, parseInt(args[1]))
          return this.client.ui.custom(message, '⏭', process.env.COLOR_INFO, `Skipped to **${song.name}**`)
        } catch {
          return this.client.ui.reply(message, 'error', 'Not a valid entry in the queue.')
        }
      } else {
        return this.client.ui.reply(message, 'error', 'You must have the DJ role on this server, or the **Manage Channel** permission to use that command. Being alone with me works too!')
      }
    }
  }
}
