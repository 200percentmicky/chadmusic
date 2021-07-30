const { Command } = require('discord-akairo')

module.exports = class CommandFreeVolume extends Command {
  constructor () {
    super('noinvites', {
      aliases: ['noinvites'],
      category: '⚙ Settings',
      description: {
        text: 'Toggles the ability to delete invite links in chat.',
        usage: '<toggle:on/off>',
        details: '`<toggle:on/off>` The toggle of the setting.'
      },
      userPermissions: ['MANAGE_GUILD']
    })
  }

  async exec (message) {
    const args = message.content.split(/ +/g)
    if (!args[1]) return this.client.ui.usage(message, 'noinvites <toggle:on/off>')

    const settings = this.client.settings
    switch (args[1]) {
      case 'on': {
        await settings.set(message.guild.id, 'noInvites', true)
        this.client.ui.say(message, 'ok', 'Invite links will now be deleted from chat. Members with the **Manage Messages** permission will be ignored.')
        break
      }
      case 'off': {
        await settings.set(message.guild.id, 'noInvites', false)
        this.client.ui.say(message, 'ok', 'Invite links will no longer be deleted from chat.')
        break
      }
      default: {
        this.client.ui.say(message, 'error', 'Toggle must be **on** or **off**.')
        break
      }
    }
  }
}
