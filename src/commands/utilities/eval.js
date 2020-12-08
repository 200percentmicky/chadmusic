const { Command } = require('discord-akairo')
const { MessageEmbed } = require('discord.js')

module.exports = class CommandEval extends Command {
  constructor () {
    super('evaljs', {
      aliases: ['evaljs', 'evjs'],
      ownerOnly: true,
      description: {
        text: 'Executes Javascript code.',
        usage: '<code>'
      },
      category: '🛠 Utilities'
    })
  }

  async exec (message) {
    const clean = text => {
      if (typeof (text) === 'string') { return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203)) } else { return text }
    }

    const args = message.content.split(/ +/g)
    const code = args.slice(1).join(' ')

    try {
      // eslint-disable-next-line no-eval
      let evaled = eval(code)

      if (typeof evaled !== 'string') {
        evaled = require('util').inspect(evaled, { depth: 0, sorted: true, maxArrayLength: 5 })
      }

      if (code.includes('.token')) {
        await message.react(this.client.emoji.warnReact)
        try {
          message.author.send(clean(evaled))
        } catch (err) {
          if (err.name === 'DiscordAPIError') return
        }
        return console.log(clean(evaled))
      } else {
        await message.react(this.client.emoji.okReact)
        return message.channel.send(clean(evaled), { code: 'js', split: true })
      }
    } catch (err) {
      message.react(this.client.emoji.errorReact)
      message.channel.send(`${err.name}: ${err.message}`, { code: 'js', split: true })
      const errorChannel = this.client.channels.cache.get('603735567733227531')
      errorChannel.send(new MessageEmbed()
        .setColor(this.client.color.warn)
        .setTitle(this.client.emoji.warn + 'eval() Error')
        .setDescription(`Input: \`${code}\``)
        .addField('\u200b', `\`\`\`js\n${err.name}: ${err.message}\`\`\``)
        .setTimestamp()
      )
    }
  }
}
