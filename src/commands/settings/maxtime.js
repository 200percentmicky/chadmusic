const { Command } = require('discord-akairo')
const { toMilliseconds } = require('colon-notation')

module.exports = class CommandMaxTime extends Command {
  constructor () {
    super('maxtime', {
      aliases: ['maxtime'],
      category: '⚙ Settings',
      description: {
        text: 'Allows you to restrict songs from being added to the queue if the duration of the video exceeds this.',
        details: 'Requires the DJ role or the **Manage Channels** permission.'
      },
      clientPermissions: ['EMBED_LINKS'],
      args: [
        {
          id: 'time',
          type: 'string'
        }
      ]
    })
  }

  async exec (message, args) {
    const dj = message.member.roles.cache.has(this.client.settings.get(message.guild.id).djRole) || message.member.hasPermission(['MANAGE_CHANNELS'])
    if (!dj) return message.forbidden('You must have the DJ role or the **Manage Channels** permissions to toggle Unlimited Volume.')
    const time = args.time
    const notation = toMilliseconds(time)

    if (time === 0 || time === 'NONE'.toLowerCase()) {
      await this.client.settings.set(message.guild.id, null, 'maxTime')
      return message.ok('Max time has been disabled.')
    }
    await this.client.settings.set(message.guild.id, notation, 'maxTime')
    return message.ok(`Max time has been set to \`${time}\``)
  }
}
