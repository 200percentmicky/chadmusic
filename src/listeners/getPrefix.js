const { Listener } = require('discord-akairo')

module.exports = class ListenerGetPrefix extends Listener {
  constructor () {
    super('getPrefix', {
      emitter: 'client',
      event: 'message'
    })
  }

  async exec (message) {
    if (message.content === this.client.user.toString() || message.content === `<@!${this.client.user.id}>`) {
      if (message.channel.type === 'dm') return message.channel.send(process.env.EMOJI_OK + 'My default prefix for music commands is ' + process.env.PREFIX)
      const prefix = this.client.prefix.getPrefix(message.guild.id)
        ? this.client.prefix.getPrefix(message.guild.id)
        : process.env.PREFIX
      return message.channel.send(process.env.EMOJI_OK + ` My prefix for music commands in **${message.guild.name}** is \`${prefix}\` | You can run \`${prefix}prefix\` to change this.`)
    }
  }
}
