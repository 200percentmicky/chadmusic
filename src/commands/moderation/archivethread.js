const { Command } = require('discord-akairo')
const { Permissions } = require('discord.js')

module.exports = class CommandArchiveThread extends Command {
  constructor () {
    super('archivethread', {
      aliases: ['archivethread', 'archive', 'at'],
      category: '⚒ Moderation',
      description: {
        text: 'Archives a thread, or changes the time to archive the thread.',
        usage: '[time] [reason]',
        details: '`[time]` The time for the thread to auto archive.'
      },
      clientPermissions: Permissions.FLAGS.MANAGE_THREADS,
      userPermissions: Permissions.FLAGS.MANAGE_THREADS,
      channel: 'guild',
      args: [
        {
          id: 'time',
          type: 'number',
          unordered: true
        },
        {
          id: 'reason',
          type: 'string',
          unordered: true
        }
      ]
    })
  }

  async exec (message, args) {
    if (message.channel.isThread()) {
      if (args.time) {
        try {
          const threadTime = {
            1: 60,
            2: 1440,
            3: 4320,
            4: 10080
          }
          await message.channel.setAutoArchiveDuration(threadTime[args.time], `${message.member.user.tag}${args.reason ? `: ${args.reason}` : ''}`)
          return message.say('ok', `Auto Archive duration set to **${threadTime[args.time]}** minutes`)
        } catch {
          if (args.time === 3 && !message.guild.features.includes('THREE_DAY_THREAD_ARCHIVE')) {
            return message.say('error', 'The server is missing the **3 Day Thread Archive** feature.')
          }
          if (args.time === 4 && !message.guild.features.includes('SEVEN_DAY_THREAD_ARCHIVE')) {
            return message.say('error', 'The server is missing the **1 Week Thread Archive** feature.')
          }
        }
      }
      await message.channel.setLocked(true, `${message.member.user.tag}${args.reason ? `: ${args.reason}` : ''}`)
    } else {
      return message.say('error', 'This is not a thread.')
    }
  }
}
