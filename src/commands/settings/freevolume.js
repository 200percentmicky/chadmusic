const { Command } = require('discord-akairo')

module.exports = class CommandFreeVolume extends Command {
  constructor () {
    super('freevolume', {
      aliases: ['freevolume'],
      category: '⚙ Settings',
      description: {
        text: 'Toggles the ability to change the volume past 200%.',
        details: 'Requires the DJ role or the **Manage Channels** permission.'
      },
      clientPermissions: ['EMBED_LINKS']
    })
  }

  async exec (message) {
    const dj = message.member.roles.cache.has(this.client.settings.get(message.guild.id).djRole) || message.member.hasPermission(['MANAGE_CHANNELS'])
    if (!dj) return message.forbidden('You must have the DJ role or the **Manage Channels** permissions to toggle Unlimited Volume.')
    const allowFreeVolume = this.client.settings.get(message.guild.id, 'allowFreeVolume')
    const toggle = allowFreeVolume !== true
    const queue = this.client.player.getQueue(message)

    if (queue) {
      if (allowFreeVolume === true) {
        this.client.player.setVolume(message, 100)
      }
    }

    await this.client.settings.set(message.guild.id, toggle, 'allowFreeVolume')
    return message.ok(`Unlimited Volume has been **${allowFreeVolume === true
      ? 'disabled**. Volume is now limited to **200%**.'
      : 'enabled**.'}
    `)
  }
}
