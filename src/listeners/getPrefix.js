const { Listener } = require('discord-akairo')
const { MessageEmbed } = require('discord.js')

module.exports = class ListenerGetPrefix extends Listener {
  constructor () {
    super('getPrefix', {
      emitter: 'client',
      event: 'message'
    })
  }

  async exec (message) {
    if (message.content === this.client.user.toString() || message.content === `<@!${this.client.user.id}>`) {
      const prefix = this.client.prefix.getPrefix(message.guild.id) ? this.client.prefix.getPrefix(message.guild.id) : this.client.config.prefix
      return message.channel.send(new MessageEmbed()
        .setColor(this.client.color.music)
        .setDescription(this.client.emoji.music + `My prefix for this server is \`${prefix}\``)
        .setFooter('You can change this anytime by using [p]musicprefix, where [p] is the currently used prefix for this server.')
      )
    }
  }
}
