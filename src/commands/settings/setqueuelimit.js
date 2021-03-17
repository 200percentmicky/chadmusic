const { Command } = require('discord-akairo')
const { setqueuelimit } = require('../../aliases.json')

module.exports = class CommandSetQueueLimit extends Command {
  constructor () {
    super(setqueuelimit !== undefined ? setqueuelimit[0] : 'setqueuelimit', {
      aliases: setqueuelimit || ['setqueuelimit'],
      category: '⚙ Settings',
      description: {
        text: 'Limits the number of entries that members can add to the queue.',
        usage: '<number>',
        details: '`<number>` The numbers of entries to limit for members.\n- DJs can bypass this limitation.'
      },
      clientPermissions: ['EMBED_LINKS'],
      userPermissions: ['MANAGE_GUILD']
    })
  }

  async exec (message) {
    const args = message.content.split(/ +/g)

    if (!args[1]) {
      const prefix = this.client.prefix.getPrefix(message.guild.id)
        ? this.client.prefix.getPrefix(message.guild.id)
        : this.client.config.prefix
      return message.say('info', `${prefix}setqueuelimit <number|none>`, 'Usage')
    }

    if (args[1] === (0 || 'NONE'.toLowerCase())) {
      await this.client.maxQueueLimit.set(message.guild.id, null)
      return message.say('ok', 'Queue Limits have been removed.')
    }

    if (isNaN(args[1])) return message.say('error', 'You must provide a number.')
    else if (args[1] < 0) return message.say('error', 'You cannot use a negative value.')

    await this.client.maxQueueLimit.set(message.guild.id, parseInt(args[1]))
    return message.say('ok', `Queue Limits have been set to \`${args[1]}\``)
  }
}
