const { Command } = require('discord-akairo')

module.exports = class CommandSetDJ extends Command {
  constructor () {
    super('setdj', {
      aliases: ['setdj'],
      category: '⚙ Settings',
      description: {
        text: 'Sets the DJ Role for this server.',
        usage: '<role>',
        details: '`<role>` The role you would like to set. Can be the name, the ID, or a mention of the role.'
      },
      clientPermissions: ['EMBED_LINKS'],
      userPermissions: ['MANAGE_GUILD']
    })
  }

  async exec (message) {
    const args = message.content.split(/ +/g)
    const text = args.slice(1).join(' ')
    const role = message.mentions.roles.first() ||
      message.guild.roles.cache.get(text) ||
      message.guild.roles.cache.find(val => val.name === args.slice(1).join(' '))

    if (!args[1]) return
    if (!role) return message.say('error', `\`${text}\` is not a valid role.`)

    await this.client.settings.set(message.guild.id, role.id, 'djRole')
    return message.say('ok', `<@&${role.id}> has been set as the DJ Role.`)
  }
}
