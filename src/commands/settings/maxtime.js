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
    if (!time) return this.client.ui.usage(message, 'maxtime <duration|0/none/off>')

    if (time === 0 || time === 'NONE'.toLowerCase() || time === 'OFF'.toLowerCase()) {
      await this.client.settings.delete(message.guild.id, 'maxTime')
      return this.client.ui.say(message, 'ok', 'Max time has been disabled.')
    }

    const notation = toMilliseconds(time)
    if (!notation) return message.error(`\`${time}\` doesn't parse to a time format. The format must be \`xx:xx\`.`)

    await this.client.settings.set(message.guild.id, 'maxTime', notation)
    return this.client.ui.say(message, 'ok', `Max time has been set to \`${time}\``)
  }
}
