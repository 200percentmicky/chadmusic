const { Command } = require('discord-akairo')

module.exports = class CommandDJMode extends Command {
  constructor () {
    super('djmode', {
      aliases: ['djmode'],
      category: '⚙ Settings',
      description: {
        text: 'Toggles DJ Mode for the server.',
        deatils: 'Requires the DJ role or the **Manage Channels** permission.'
      },
      clientPermissions: ['EMBED_LINKS']
    })
  }

  async exec (message) {
    const dj = message.member.roles.cache.has(await this.client.djRole.get(message.guild.id)) || message.member.hasPermission(['MANAGE_CHANNELS'])
    if (!dj) return message.say('no', 'You must have the DJ role or the **Manage Channels** permissions to toggle DJ Mode.')

    const args = message.content.split(/ +/g)
    if (!args[1]) return message.usage('djmode <toggle:on/off>')
    if (args[1] === 'ON'.toLowerCase()) {
      await this.client.djMode.set(message.guild.id, true)
      return message.say('ok', 'DJ Mode has been **enabled**.')
    } else if (args[1] === 'OFF'.toLowerCase()) {
      await this.client.djMode.set(message.guild.id, false)
      return message.say('ok', 'DJ Mode has been **disabled**.')
    }
  }
}
