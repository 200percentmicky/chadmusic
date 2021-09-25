const { Command } = require('discord-akairo')

module.exports = class CommandDJMode extends Command {
  constructor () {
    super('djmode', {
      aliases: ['djmode'],
      category: '⚙ Settings',
      description: {
        text: 'Toggles DJ Mode for the server.',
        usage: '<toggle:on/off>',
        details: 'Requires the DJ role or the **Manage Channels** permission.'
      },
      clientPermissions: ['EMBED_LINKS']
    })
  }

  async exec (message) {
    const djRole = this.client.settings.get(message.guild.id, 'djRole')
    const dj = message.member.roles.cache.has(djRole) || message.channel.permissionsFor(message.member.user.id).has(['MANAGE_CHANNELS'])
    if (!dj) return this.client.ui.say(message, 'no', 'You must have the DJ role or the **Manage Channels** permissions to toggle DJ Mode.')

    const args = message.content.split(/ +/g)
    if (!args[1]) return this.client.ui.usage(message, 'djmode <toggle:on/off>')
    if (args[1] === 'ON'.toLowerCase()) {
      await this.client.settings.set(message.guild.id, 'djMode', true)
      return this.client.ui.say(message, 'ok', 'DJ Mode has been **enabled**.')
    } else if (args[1] === 'OFF'.toLowerCase()) {
      await this.client.settings.set(message.guild.id, 'djMode', false)
      return this.client.ui.say(message, 'ok', 'DJ Mode has been **disabled**.')
    } else {
      return this.client.ui.reply(message, 'error', 'Toggle must be **on** or **off**.')
    }
  }
}
