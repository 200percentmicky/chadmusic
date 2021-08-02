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
      userPermissions: ['MANAGE_GUILD']
    })
  }

  async exec (message) {
    const args = message.content.split(/ +/g)
    const volume = parseInt(args[1])

    if (!volume) {
      return message.usage('defaultvolume <int:volume|1-200>')
    }

    if (isNaN(volume)) {
      return message.say('error', 'Default volume must be a number.')
    }

    if (volume > 200 || volume < 1) {
      return message.say('error', 'Default volume must be between **1-200**.')
    }

    await this.client.settings.set(message.guild.id, 'defaultVolume', volume)
    return message.say('ok', `The default volume is now **${volume}%**.`)
  }
}
