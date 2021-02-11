const { Listener } = require('discord-akairo')

// This is to ensure that all guilds the bot has access to has the default settings applied.
// The bot will not function without any setting present.
module.exports = class ListenerEnsureSettings extends Listener {
  constructor () {
    super('ensureSettings', {
      emitter: 'client',
      event: 'message'
    })
  }

  async exec (message) {
    if (message.channel.type === 'dm') return
    const settings = this.client.settings.get(message.guild.id)
    if (!settings) this.client.settings.ensure(message.guild.id, this.client.defaults)
  }
}
