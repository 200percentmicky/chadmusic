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
    const dj = message.member.roles.cache.has(this.client.settings.get(message.guild.id).djRole) || message.member.hasPermission(['MANAGE_CHANNELS'])
    if (!dj) return message.say('no', 'You must have the DJ role or the **Manage Channels** permissions to toggle DJ Mode.')
    const settings = this.client.settings

    const args = message.content.split(/ +/g)
    if (args[1] === 'ON'.toLowerCase()) await settings.set(message.guild.id, true, 'djMode')
    else if (args[1] === 'OFF'.toLowerCase()) await settings.set(message.guild.id, false, 'djMode')

    const djMode = settings.get(message.guild.id, 'djMode')
    return message.say('ok', `DJ Mode has been **${djMode === true ? 'enabled' : 'disabled'}**.`)
  }
}
