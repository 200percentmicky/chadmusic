/* eslint-disable no-mixed-spaces-and-tabs */
const { Command } = require('discord-akairo')
const { MessageEmbed } = require('discord.js')

module.exports = class CommandBan extends Command {
  constructor () {
    super('ban', {
      aliases: ['ban', 'b', 'hammer'],
      clientPermissions: ['BAN_MEMBERS'],
      userPermissions: ['BAN_MEMBERS'],
      description: {
        text: 'Bans a member from the server.',
        usage: '<@user> [days] [reason]',
        details: '`<@user>` The guild member to ban\n`[days]` The number of days to delete messages.\n`[reason]` The reason for the ban.'
      },
      channel: 'guild',
      category: '⚒ Moderation'
    })
  }

  async exec (message) {
    const args = message.content.split(/ +/g)
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[1])

    if (!args[1]) {
      return message.usage('ban <@user> [days] [reason]')
    }

    if (!member) {
      // Such a mortal doesn't exist.
      return message.say('warn', `\`${args[1]}\` is not a valid member or user ID.`)
    }

    if (!member.bannable) { // Can't ban them, or you tried banning yourself. lol
      return message.say('error', member === message.member
        ? 'You cannot ban yourself from the server.'
        : `Unable to ban **${member.user.tag}**.`
      )
    }

    let days = parseInt(args[2])
    let reason = args.slice(3).join(' ')
    if (!reason) reason = 'No reason provided...'
    if (isNaN(days)) {
      days = 0
      reason = args.slice(2).join(' ')
      if (!reason) reason = 'No reason provided...'
    }

    const responses = [
      `Done. **${member.user.tag}** is now banned from the server.`,
      `**${member.user.tag}** is now gone, forever.`,
      `And just like that, **${member.user.tag}** has been banned.`,
      `**${member.user.tag}** has been struck by the ban hammer!`
    ]

    const randomResponse = responses[Math.floor(Math.random() * responses.length)]

    try {
      await member.user.send(new MessageEmbed()
        .setColor(this.client.color.ban)
        .setAuthor(`You have been banned from ${message.guild.name}`, message.guild.iconURL({ dynamic: true }))
        .setDescription(`**Reason:** ${reason}`)
        .setTimestamp()
        .setFooter(`${message.author.tag} • ID: ${message.author.id}`, message.author.avatarURL({ dynamic: true }))
      )
    } catch (err) {
      return
    } finally {
      await member.ban({ days: days, reason: `${message.author.tag}: ${reason}` })
      message.custom('🔨', this.client.color.ban, randomResponse)
      message.guild.recordCase('ban', message.author.id, member.user.id, reason)
    }
  }
}
