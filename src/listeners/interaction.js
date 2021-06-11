const { Listener } = require('discord-akairo')

module.exports = class ListenerInteraction extends Listener {
  constructor () {
    super('interaction', {
      emitter: 'client',
      event: 'interaction'
    })
  }

  async exec (interaction) {
    if (!interaction.isMessageComponent() && interaction.componentType !== 'BUTTON') return
    interaction.deferUpdate()
  }
}
