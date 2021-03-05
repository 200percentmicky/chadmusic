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
        usage: '<number>'
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
    if (args.deleteCount) {
      try {
        await message.delete()
        message.channel.bulkDelete(args.deleteCount)
        return
      } catch (err) {
        return message.say('error', err.message)
      }
    } else {
      return message.say('error', 'Number must be between 2 and 100.')
    }
  }
}
