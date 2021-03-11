const { Listener } = require('discord-akairo')
const Cleverbot = require('cleverbot')

module.exports = class ListenerCleverbot extends Listener {
  constructor () {
    super('cleverbot', {
      emitter: 'client',
      event: 'message'
    })
  }

  async exec (message) {
    const args = message.content.split(/ +/g)
    const text = args.slice(1).join(' ')
    const mention = `<@!${this.client.user.id}>`
    const cleverbot = new Cleverbot({ key: this.client.config.clbot_api })

    if (message.content.startsWith(mention)) {
      // Completely prevents Cleverbot from responding.
      // Provides the prefix of the bot in case they forgot.
      message.channel.startTyping()
      try {
        await cleverbot.query(text).then(response => {
          message.channel.send(response.output)
        })
        return message.channel.stopTyping()
      } catch (err) {
        if (err) {
          await message.react('❓')
          message.reply('I\'m afraid I can\'t understand your message. Please trying sending a message without unicode characters.')
          return message.channel.stopTyping()
        }
      }
    }
  }
}
