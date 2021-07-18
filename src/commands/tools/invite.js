const { Command } = require('discord-akairo')
const { MessageEmbed, Permissions } = require('discord.js')
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
    let msg = new MessageEmbed()
      .setColor(process.env.COLOR_BLOOD)
      .setAuthor('Links!', this.client.user.avatarURL({ dynamic: true }))
      .setDescription(`${process.env.EMOJI_CUTIE} **[Add me to your server!](${invite})**\n🆘 **[Support Server](${server})**`)
    if (!message.channel.permissionsFor(this.client.user.id).has(Permissions.FLAGS.EMBED_LINKS)) {
      msg = `${process.env.EMOJI_CUTIE} **Here's my invite link. Enjoy!**\n<${invite}>\n🆘 **Support Server**\n${server}`
      return message.channel.send(msg)
    } else {
      return message.channel.send({ embeds: [msg] })
    }
  }
}
