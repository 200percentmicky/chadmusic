const { Command } = require('discord-akairo')

module.exports = class PingCommand extends Command {
  constructor () {
    super('ping', {
      aliases: ['ping'],
      description: {
        text: 'Tests the bot\'s connection to Discord.'
      },
      category: '💻 Core'
    })
  }

  async exec (message) {
    const ping = await message.channel.send(process.env.EMOJI_LOADING + 'Ping?')

    const timeDiff = (ping.editedAt || ping.createdAt) - (message.editedAt || message.createdAt)

    await ping.edit(`${process.env.EMOJI_OK} **Pong!**\n📩: \`${timeDiff}ms.\`\n💟: \`${Math.round(this.client.ws.ping)}ms.\``)
  }
}
