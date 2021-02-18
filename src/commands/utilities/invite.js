const { Command } = require('discord-akairo')
const { MessageEmbed } = require('discord.js')

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
    const invite = 'https://discord.com/api/oauth2/authorize?client_id=804609901699399710&permissions=37055552&scope=bot%20applications.commands'
    const server = 'https://discord.gg/qQuJ9YQ'
    return message.channel.send(new MessageEmbed()
      .setColor(this.client.color.blood)
      .setAuthor('Links', this.client.user.avatarURL({ dynamic: true }))
      .setDescription(`**[Invite me!](${invite})**\n**[Support Server](${server})**`)
    )
  }
}
