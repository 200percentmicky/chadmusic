const { Listener } = require('discord-akairo')

module.exports = class ListenerInteractionCreate extends Listener {
  constructor () {
    super('interactionCreate', {
      emitter: 'client',
      event: 'interactionCreate'
    })
  }

  async exec (interaction) {
    if (!interaction.isMessageComponent()) return
    interaction.deferUpdate()
  }
}
