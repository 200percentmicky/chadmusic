const { Command } = require('discord-akairo')
const _ = require('lodash')

module.exports = class CommandAllowlist extends Command {
  constructor () {
    super('allowlist', {
      aliases: ['allowlist', 'whitelist'],
      category: '💻 Core',
      description: {
        text: 'Remove users or guilds from the blocklist.',
        usage: '<type> <id>',
        details: '`<type>` The type to remove. Either a user or a guild.\n`<id>` The ID of the user or the guild.'
      },
      ownerOnly: true
    })
  }

  async exec (message) {
    const args = message.content.split(/ +/g)
    const blocklist = this.client.blocklist

    if (!args[1]) return this.client.ui.usage(message, 'blocklist <type> <id>')
    const switchType = args[1].toLowerCase()
    switch (switchType) {
      case 'user': {
        const userList = await blocklist.get('user')
        const user = parseInt(args[2])
        if (isNaN(user)) return this.client.ui.say(message, 'error', 'You must provide the user\'s ID.')
        if (!userList.includes(args[2])) return this.client.ui.say(message, 'error', `User ID \`${args[2]}\` is not in the blocklist retard.`)
        const newArray = _.pull(userList, args[2])
        await blocklist.set('user', newArray)
        this.client.ui.say(message, 'ok', `Removed User ID \`${args[2]}\` from the blocklist.`)
        break
      }

      case 'guild': {
        const guildList = await blocklist.get('guild')
        const guild = parseInt(args[2])
        if (isNaN(guild)) return this.client.ui.say(message, 'error', 'You must provide the guild\'s ID.')
        if (!guildList.includes(args[2])) return this.client.ui.say(message, 'error', `Guild ID \`${args[2]}\` is not in the blocklist retard.`)
        const newArray = _.pull(guildList, args[2])
        await blocklist.set('guild', newArray)
        this.client.ui.say(message, 'ok', `Removed Guild ID \`${args[2]}\` from the blocklist.`)
        break
      }

      default: {
        this.client.ui.say(message, 'error', 'Type must be a **user** or a **guild**.')
        break
      }
    }
  }
}
