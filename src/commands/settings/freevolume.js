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
    if (!dj) return message.say('no', 'You must have the DJ role or the **Manage Channels** permissions to toggle Unlimited Volume.')

    const settings = this.client.settings
    const queue = this.client.player.getQueue(message)

    const args = message.content.split(/ +/g)
    if (args[1] === 'OFF'.toLowerCase()) {
      if (queue) {
        if (queue.volume > 200) this.client.player.setVolume(message, 100)
      }
      await settings.set(message.guild.id, false, 'allowFreeVolume')
    } else if (args[1] === 'ON'.toLowerCase()) await settings.set(message.guild.id, true, 'allowFreeVolume')

    const allowFreeVolume = settings.get(message.guild.id, 'allowFreeVolume')
    const toggled = allowFreeVolume === true
      ? '**enabled**.'
      : '**disabled**. Volume is now limited to **200%**'
    return message.say('ok', `Unlimited Volume is now ${toggled}`)
  }
}
