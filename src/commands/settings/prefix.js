const { Command } = require('discord-akairo')
const { prefix } = require('../../aliases.json')

module.exports = class CommandPrefix extends Command {
  constructor () {
    super(prefix !== undefined ? prefix[0] : 'prefix', {
      aliases: prefix || ['prefix'],
      category: '⚙ Settings',
      description: {
        text: 'Changes the bot\'s prefix for this server.',
        usage: '<prefix>',
        details: '`<prefix>` The new prefix you want to use. If none, resets the prefix to defaults.'
      },
      clientPermissions: ['EMBED_LINKS'],
      userPermissions: ['MANAGE_GUILD']
    })
  }

  async exec (message) {
    const args = message.content.split(/ +/g)
    const prefix = args[1]

    if (!args[1]) {
      await this.client.prefix.setPrefix(process.env.PREFIX, message.guild.id)
      return message.say('ok', `The prefix for music commands has been reset to \`${process.env.PREFIX}\``)
    }
    await this.client.prefix.setPrefix(prefix, message.guild.id)
    return message.say('ok', `The prefix for music commands has been set to \`${prefix}\``)
  }
}
