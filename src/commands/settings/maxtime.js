const { Command } = require('discord-akairo')
const { toMilliseconds } = require('colon-notation')

module.exports = class CommandMaxTime extends Command {
  constructor () {
    super('maxtime', {
      aliases: ['maxtime'],
      category: '⚙ Settings',
      description: {
        text: 'Allows you to restrict songs from being added to the queue if the duration of the video exceeds this.',
        usage: '<duration>',
        details: '`<duration>` The max duration of the song to limit. Members will be unable to add any songs that go past this limit. DJs can bypass this.'
      },
      clientPermissions: ['EMBED_LINKS'],
      userPermissions: ['MANAGE_GUILD'],
      args: [
        {
          id: 'time',
          type: 'string'
        }
      ]
    })
  }

  async exec (message, args) {
    const time = args.time
    const notation = toMilliseconds(time)

    if (!time) message.usage('time <duration>')

    if (time === 0 || time === 'NONE'.toLowerCase()) {
      await this.client.maxTime.set(message.guild.id, null)
      return message.say('ok', 'Max time has been disabled.')
    }
    await this.client.maxTime.set(message.guild.id, notation)
    return message.say('ok', `Max time has been set to \`${time}\``)
  }
}
