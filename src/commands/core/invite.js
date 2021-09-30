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
      .setColor(message.guild.me.displayColor !== 0 ? message.guild.me.displayColor : null)
      .setAuthor('Links!', this.client.user.avatarURL({ dynamic: true }))
      .setDescription(`${process.env.EMOJI_CUTIE} **[Add me to your server!](${invite})**\n🆘 **[Support Server](${server})**`)
      .setFooter('Manage Server permission is required to invite me.')
    if (!message.channel.permissionsFor(this.client.user.id).has(Permissions.FLAGS.EMBED_LINKS)) {
      msg = `**Links!**\n\n${process.env.EMOJI_CUTIE} **Add me to your server!**\n<${invite}>\n🆘 **Support Server**\n${server}\n\n**Manage Server** permission is required to invite me.`
      return message.channel.send({ content: `${msg}` })
    } else {
      return message.channel.send({ embeds: [msg] })
    }
  }
}
