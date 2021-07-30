const { Command } = require('discord-akairo')

module.exports = class CommandDefaultVolume extends Command {
  constructor () {
    super('defaultvolume', {
      aliases: ['defaultvolume'],
      category: '⚙ Settings',
      description: {
        text: "Changes the bot's default volume when starting a queue, or when disabling Earrape.",
        usage: '<int:volume|1-200>',
        details: '`<int:volume|1-200>` The new volume for the server.'
      },
      clientPermissions: ['EMBED_LINKS'],
      userPermissions: ['MANAGE_GUILD'],
      args: [
        {
          id: 'volume',
          type: 'string'
        }
      ]
    })
  }

  async exec (message, args) {
    const volume = parseInt(args.volume)

    if (!volume) {
      return this.client.ui.usage(message, 'defaultvolume <int:volume|1-200>')
    }

    if (isNaN(volume)) {
      return this.client.ui.say(message, 'error', 'Default volume must be a number.')
    }

    if (volume > 200 || volume < 1) {
      return this.client.ui.say(message, 'error', 'Default volume must be between **1-200**.')
    }

    await this.client.settings.set(message.guild.id, 'defaultVolume', volume)
    return this.client.ui.say(message, 'ok', `The default volume is now **${volume}%**.`)
  }
}
