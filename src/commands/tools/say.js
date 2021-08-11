const { Command } = require('discord-akairo')

module.exports = class CommandTest extends Command {
  constructor () {
    super('say', {
      aliases: ['say'],
      category: '🔧 Tools',
      description: {
        text: 'Sends a message as the bot.',
        usage: '[channelid] <text>'
      },
      userPermissions: ['ADMINISTRATOR']
    })
  }

  async exec (message) {
    const args = message.content.split(/ +/g)
    const target = this.client.channels.cache.find(val => val.id === args[1])

    let text = args.slice(1).join(' ')

    if (target) {
      if (message.author.id === this.client.config.owner) {
        text = args.slice(2).join(' ')
        if (!target.permissionsFor(this.client.user.id).has(['SEND_MESSAGES'])) {
          return this.client.ui.say(message, 'error', `Missing **Send Messages** permission for Channel ID: \`${args[1]}\``)
        }
        await target.send(text)
        return this.client.ui.say(message, 'ok', `I sent your message to Channel ID: \`${args[1]}\``)
      } else {
        text = args.slice(1).join(' ')
        return message.channel.send(text)
      }
    } else {
      if (!text) return
      await message.channel.send(text)
      if (message.channel.type === 'dm') return
      if (message.channel.permissionsFor(this.client.user.id).has(['MANAGE_MESSAGES'])) message.delete()
    }
  }
}
