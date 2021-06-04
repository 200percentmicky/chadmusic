const { Command } = require('discord-akairo')
const { invite } = require('../../aliases.json')

module.exports = class InviteCommand extends Command {
  constructor () {
    super(invite !== undefined ? invite[0] : 'invite', {
      aliases: invite || ['invite'],
      description: {
        text: 'Sends the bot\'s invite link.'
      },
      category: '💻 Core'
    })
  }

  async exec (message) {
    const invite = process.env.BOT_INVITE
    const server = process.env.SERVER_INVITE
    const msg = `${process.env.EMOJI_CUTIE} **Here's my invite link. Enjoy!**\n<${invite}>\n\n🆘 **Support Server**\n${server}`
    return message.channel.send(msg)
  }
}
