const { Command } = require('discord-akairo')
const { stripIndents } = require('common-tags')
const { MessageEmbed } = require('discord.js')

module.exports = class CommandAvatar extends Command {
  constructor () {
    super('avatar', {
      aliases: ['avatar', 'pfp'],
      channel: 'guild',
      category: '🔧 Tools',
      clientPermissions: ['EMBED_LINKS'],
      description: {
        text: 'Retrieves the URL of a person\'s profile picture',
        usage: '[options] [@user/id]',
        details: stripIndents`
        \`guild|server\` - Retrieve the server's icon instead.
        `
      }
    })
  }

  async exec (message) {
    const args = message.content.split(/ +/g)

    const small = '?size=256'
    const medium = '?size=512'
    const large = '?size=1024'
    const xlarge = '?size=2048'

    // Get the guild's icon.
    if (args[1] === 'guild' || args[1] === 'server') {
      const serverurl = message.guild.iconURL({ dynamic: true })
      if (!serverurl) {
        return message.say('warn', 'This server doesn\'t have an icon.')
      }

      const sizes = `**[Small](${serverurl}${small}) | [Medium](${serverurl}${medium}) | [Large](${serverurl}${large}) | [XLarge](${serverurl}${xlarge})**`

      const embed = new MessageEmbed()
        .setColor(0xFF597D)
        .setAuthor(`Server Icon for ${message.guild.name}`, message.guild.iconURL({ dynamic: true }))
        .setImage(serverurl + large)
        .addField('Sizes:', `${sizes}`)
      return message.channel.send({ embed: [embed] })
    }

    const member = message.mentions.members.first() || message.guild.members.cache.get(args[1]) || message.member
    const avatarcolor = member ? member.displayColor : message.member.displayColor
    const pfpurl = member ? member.user.avatarURL({ dynamic: true }) : message.author.avatarURL({ dynamic: true })
    const sizes = `**[Small](${pfpurl}${small}) | [Medium](${pfpurl}${medium}) | [Large](${pfpurl}${large}) | [XLarge](${pfpurl}${xlarge})**`

    const isAuthor = member === message.member ? 'Your Avatar' : `Avatar for ${member.user.tag}`

    const embed = new MessageEmbed()
      .setColor(avatarcolor)
      .setAuthor(isAuthor, member.user.avatarURL({ dynamic: true }))
      .setImage(pfpurl + large)
      .addField('Sizes:', `${sizes}`)

    if (!args[1]) { // For the author only.
      return message.channel.send({ embed: [embed] })
    }

    // Does this member exist?
    if (!member) return message.say('warn', `\`${args[1]}\` is not a valid member.`)

    // Check's to see if a URL is present.
    if (!pfpurl) {
      if (message.author) {
        return message.say('warn', 'You don\'t have an avatar set.')
      } else {
        return message.say('warn', 'This member doesn\'t have an avatar.')
      }
    }

    // Finally show off an avatar!
    return message.channel.send({ embed: [embed] })
  }
}
