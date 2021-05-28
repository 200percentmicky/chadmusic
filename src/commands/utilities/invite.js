const { Command } = require('discord-akairo')
const { MessageEmbed } = require('discord.js')
const { invite } = require('../../aliases.json')

module.exports = class InviteCommand extends Command {
  constructor () {
    super(invite !== undefined ? invite[0] : 'invite', {
      aliases: invite || ['invite'],
      description: {
        text: 'Sends the bot\'s invite link.'
      },
      category: '🛠 Utilities'
    })
  }

  async exec (message) {
    const invite = process.env.BOT_INVITE
    const server = process.env.SERVER_INVITE
    return message.channel.send(new MessageEmbed()
      .setColor(this.client.color.blood)
      .setAuthor('Links', this.client.user.avatarURL({ dynamic: true }))
      .setDescription(`**[Invite me!](${invite})**\n**[Support Server](${server})**`)
    )
  }
}
