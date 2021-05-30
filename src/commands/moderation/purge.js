const { Command, Argument } = require('discord-akairo')

module.exports = class CommandPurge extends Command {
  constructor () {
    super('purge', {
      aliases: ['purge', 'pr', 'clean'],
      channel: 'guild',
      userPermissions: ['MANAGE_MESSAGES'],
      clientPermissions: ['MANAGE_MESSAGES'],
      category: '⚒ Moderation',
      description: {
        text: 'Bulk delete messages from chat.',
        usage: '<number:2-100>'
      },
      args: [
        {
          id: 'deleteCount',
          type: Argument.range('number', 2, 100),
          default: undefined
        }
      ]
    })
  }

  async exec (message, args) {
    if (!args) return message.usage('purge <number:2-100>')
    if (args.deleteCount) {
      try {
        message.delete()
        message.channel.bulkDelete(args.deleteCount)
        return
      } catch (err) {
        return message.say('error', err.message)
      }
    } else {
      return message.say('warn', 'Number must be between 2 and 100.')
    }
  }
}
