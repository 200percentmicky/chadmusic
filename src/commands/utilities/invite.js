const { Command } = require('discord-akairo')

module.exports = class InviteCommand extends Command {
  constructor () {
    super('invite', {
      aliases: ['invite'],
      description: {
        text: 'Sends the bot\'s invite link.'
      },
      category: '🛠 Utilities'
    })
  }

  async exec (message) {
    return message.ok(`**→ [Invite me!](${this.client.config.botinvite})**\n**→ [Support Server](${this.client.config.invite})**`)
  }
}
