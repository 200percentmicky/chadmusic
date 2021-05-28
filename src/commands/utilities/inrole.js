const { Command } = require('discord-akairo')
const { FieldsEmbed } = require('discord-paginationembed')

module.exports = class CommandInRole extends Command {
  constructor () {
    super('inrole', {
      aliases: ['inrole'],
      category: '⚙ Utilities',
      description: {
        text: 'Returns a list of all members within a role.',
        usage: '<role>',
        details: '`<role>` The role you want to view a list for. Can be a mention, the name of the role, or a role ID.'
      },
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS']
    })
  }

  async exec (message) {
    const args = message.content.split(/ +/g)
    const role = message.mentions.roles.first() ||
            message.guild.roles.cache.get(args[1]) ||
            message.guild.roles.cache.find(val => val.name === args.slice(1).join(' '))
    if (!role) return message.say('error', `\`${args.slice(1).join(' ')}\` is not a valid role on this server.`)
    const memberList = role.members.array()

    const embed = new FieldsEmbed()
      .setArray(memberList)
      .setAuthorizedUsers(message.author.id)
      .setChannel(message.channel)
      .setElementsPerPage(8)
      .setPage(1)
      .setPageIndicator('footer')
      .setNavigationEmojis({
        back: '◀',
        jump: '↗',
        forward: '▶',
        delete: '❌'
      })
      .formatField(`${memberList.length} member${memberList == 1 ? ' has' : 's have'} this role.`, member => member.user.tag)
      .setTimeout(60000)

    embed.embed
      .setColor(role.color)
      .setAuthor(role.name)
      .setFooter(null) // This is required if you use .setPageIndicator('footer').

    embed.build()
  }
}
