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
      clientPermissions: ['EMBED_LINKS'],
      userPermissions: ['MANAGE_GUILD']
    })
  }

  async exec (message) {
    const args = message.content.split(/ +/g)
    if (!args[1]) return message.usage('freevolume <toggle:on/off>')
    if (args[1] === 'OFF'.toLowerCase()) {
      const queue = this.client.player.getQueue(message)
      if (queue) {
        if (queue.volume > 200) this.client.player.setVolume(message, 100)
      }
      await this.client.allowFreeVolume.set(message.guild.id, false)
      return message.say('ok', 'Unlimited Volume has been **disabled**. Volume is now limited to **200%**.')
    } else if (args[1] === 'ON'.toLowerCase()) {
      await this.client.allowFreeVolume.set(message.guild.id, true)
      return message.say('ok', 'Unlimited Volume has been **enabled**.')
    } else {
      return message.say('error', 'Toggle must be **on** or **off**.')
    }
  }
}
