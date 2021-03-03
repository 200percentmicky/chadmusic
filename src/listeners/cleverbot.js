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
      if (message.content === mention) {
        if (message.author.bot) return
        const guildPrefix = this.client.prefix.getPrefix(message.guild.id)
        return message.say(`My prefix ${guildPrefix ? `for **${message.guild.name}**` : ''} is \`${guildPrefix || this.client.config.prefix}\``, null, this.client.color.blood, this.client.emoji.cutie)
      } else {
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
}
