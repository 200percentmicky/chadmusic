const { Command } = require('discord-akairo')

module.exports = class CommandAllowFilters extends Command {
  constructor () {
    super('allowfilters', {
      aliases: ['allowfilters'],
      category: '⚙ Settings',
      description: {
        text: 'Toggles the ability to allow members to apply filters to the player.',
        usage: '<toggle:all/dj>',
        details: '`<toggle:all/dj>` The toggle of the setting. Accepts **all** or **dj**. If set to **dj**, only DJs will be able to apply filters to the player.'
      },
      clientPermissions: ['EMBED_LINKS'],
      userPermissions: ['MANAGE_GUILD']
    })
  }

  async exec (message) {
    const args = message.content.split(/ +/g)
    if (!args[1]) return message.usage('allowfilters <toggle:all/dj>')
    if (args[1] === 'DJ'.toLowerCase()) {
      await this.client.allowFilters.set(message.guild.id, 'dj')
      return message.say('ok', 'Allow Filters has been set to **DJ only**.')
    } else if (args[1] === 'ALL'.toLowerCase()) {
      await this.client.allowFreeVolume.set(message.guild.id, 'all')
      return message.say('ok', 'Allow Filters has been set to **All**.')
    } else {
      return message.say('error', 'Toggles must be **dj** or **all**')
    }
  }
}
