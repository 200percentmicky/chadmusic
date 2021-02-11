const { Command } = require('discord-akairo')
const { ping } = require('../../aliases.json')

module.exports = class PingCommand extends Command {
  constructor () {
    super(ping !== undefined ? ping[0] : 'ping', {
      aliases: ping || ['ping'],
      description: {
        text: 'Tests the bot\'s connection to Discord.'
      },
      category: '🛠 Utilities'
    })
  }

  async exec (message) {
    const ping = await message.channel.send(this.client.emoji.loading + 'Ping?')

    const timeDiff = (ping.editedAt || ping.createdAt) - (message.editedAt || message.createdAt)

    await ping.edit(`${this.client.emoji.music}**Pong!**\n📩: \`${timeDiff}ms.\`\n💟: \`${Math.round(this.client.ws.ping)}ms.\``)
  }
}
