/* eslint-disable no-mixed-spaces-and-tabs */
const { Command } = require('discord-akairo')
const { MessageEmbed } = require('discord.js')
const { stripIndents } = require('common-tags')

module.exports = class CommandSoftban extends Command {
  constructor () {
    super('softban', {
      aliases: ['softban', 'sb', 'soft'],
      clientPermissions: ['BAN_MEMBERS'],
      userPermissions: ['BAN_MEMBERS'],
      description: {
        text: 'Kicks a member from the server while deleting a day worth of messages.',
        usage: '<@user> [reason]',
        details: stripIndents`
        \`<@user>\` The guild member to softban.
        \`[reason]\` The reason for the softban.
        `
      },
      channel: 'guild',
      category: '⚒ Moderation'
    })
  }

  async exec (message) {
    const args = message.content.split(/ +/g)
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[1])

    if (!args[1]) {
      return message.usage('softban <@user> [reason]')
    }

    if (!member) {
      // Such a mortal doesn't exist.
      return message.say('warn', `\`${args[1]}\` is not a valid member.`)
    }

    if (!member.bannable) {
      return message.say('error', member === message.member
        ? 'You cannot softban yourself from the server.'
        : `Unable to softban **${member.user.username}**#${member.user.discriminator}.`
      )
    }

    let reason = args.slice(2).join(' ')
    if (!reason) reason = 'No reason provided...'

    const responses = [
      `And like that, **${member.user.tag}** has been softbanned!`,
      `**${message.user.tag}** has been softbanned.`,
      `**${message.user.tag}** posted something silly.`
    ]

    const randomResponse = responses[Math.floor(Math.random() * responses.length)]

    try {
      message.delete()
      await member.user.send(new MessageEmbed()
        .setColor(this.client.color.softban)
        .setAuthor(`You have been softbanned from ${message.guild.name}`, message.guild.iconURL({ dynamic: true }))
        .setDescription(`**Reason:** ${reason}`)
      )
      await member.ban({ days: 1, reason: `${message.author.tag}: ${reason}` })
      await message.guild.members.unban(member.user.id)
      await message.guild.recordCase('softban', message.author.id, member.user.id, reason)
      return message.channel.send(new MessageEmbed()
        .setColor(this.client.color.softban)
        .setAuthor(randomResponse, member.user.avatarURL({ dynamic: true }))
      )
    } catch (err) {
      return message.say('error', err.message)
    }
  }
}
