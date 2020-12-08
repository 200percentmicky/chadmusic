const { Listener } = require('discord-akairo')

module.exports = class ListenerDefaultPrefix extends Listener {
  constructor () {
    super('DefaultPrefix', {
      emitter: 'client',
      event: 'guildCreate'
    })
  }

  async exec (guild) {
    await this.client.settings.set(guild.id, this.client.config.prefix, 'prefix')
  }
}
