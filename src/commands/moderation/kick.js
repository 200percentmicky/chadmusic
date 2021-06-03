/* eslint-disable no-mixed-spaces-and-tabs */
const { Command } = require('discord-akairo')
const { MessageEmbed } = require('discord.js')
const { stripIndents } = require('common-tags')

module.exports = class CommandKick extends Command {
  constructor () {
    super('kick', {
      aliases: ['kick', 'k', 'boot'],
      clientPermissions: ['KICK_MEMBERS'],
      userPermissions: ['KICK_MEMBERS'],
      description: {
        text: 'Kicks a member from the server.',
        details: stripIndents`
        \`<@user>\` The guild member to kick.
        \`[reason]\` The reason for the kick.
        `,
        usage: '<@user> [reason]'
      },
      channel: 'guild',
      category: '⚒ Moderation'
    })
  }

  async exec (message) {
    const args = message.content.split(/ +/g)
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[1])

    if (!args[1]) {
      return message.usage('kick <@user> [reason]')
    }

    if (!member) {
      // Such a mortal doesn't exist.
      return message.say('warn', `\`${args[1]}\` is not a valid member or user ID.`)
    }

    if (!member.kickable) {
      return message.say('error', member === message.member
        ? 'You cannot kick yourself from the server.'
        : `Unable to kick **${member.user.tag}**.`
      )
    }

    let reason = args.slice(2).join(' ')
    if (!reason) reason = 'No reason provided...'

    const responses = [
      `Done. **${member.user.tag}** has been kicked from the server.`,
      `And just like that, **${member.user.tag}** has been kicked.`,
      `**${member.user.tag}** has been yeeted.`
    ]

    const randomResponse = responses[Math.floor(Math.random() * responses.length)]

    try {
      await member.user.send(new MessageEmbed()
        .setColor(this.client.color.ban)
        .setAuthor(`You have been kicked from ${message.guild.name}`, message.guild.iconURL({ dynamic: true }))
        .setDescription(`**Reason:** ${reason}`)
        .setTimestamp()
        .setFooter(`${message.author.tag} • ID: ${message.author.id}`, message.author.avatarURL({ dynamic: true }))
      )
    } catch (err) {
      return
    } finally {
      await member.kick(`${message.author.tag}: ${reason}`)
      message.custom('👢', this.client.color.kick, randomResponse)
      message.guild.recordCase('kick', message.author.id, member.user.id, reason)
    }
  }
}
