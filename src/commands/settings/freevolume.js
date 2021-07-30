const { Command } = require('discord-akairo')

module.exports = class CommandFreeVolume extends Command {
  constructor () {
    super('freevolume', {
      aliases: ['freevolume'],
      category: '⚙ Settings',
      description: {
        text: 'Toggles the ability to change the volume past 200%.',
        usage: '<toggle:on/off>',
        details: 'Requires the DJ role or the **Manage Channels** permission.'
      },
      clientPermissions: ['EMBED_LINKS'],
      userPermissions: ['MANAGE_GUILD']
    })
  }

  async exec (message) {
    const args = message.content.split(/ +/g)
    const volume = this.client.settings.get(message.guild.id, 'defaultVolume', 100)
    if (!args[1]) return this.client.ui.usage(message, 'freevolume <toggle:on/off>')
    if (args[1] === 'OFF'.toLowerCase()) {
      const queue = this.client.player.getQueue(message)
      if (queue) {
        if (queue.volume > 200) this.client.player.setVolume(message, volume)
      }
      await this.client.settings.set(message.guild.id, 'allowFreeVolume', false)
      return this.client.ui.say(message, 'ok', 'Unlimited Volume has been **disabled**. Volume is now limited to **200%**.')
    } else if (args[1] === 'ON'.toLowerCase()) {
      await this.client.settings.set(message.guild.id, 'allowFreeVolume', true)
      return this.client.ui.say(message, 'ok', 'Unlimited Volume has been **enabled**.')
    } else {
      return this.client.ui.say(message, 'error', 'Toggle must be **on** or **off**.')
    }
  }
}
