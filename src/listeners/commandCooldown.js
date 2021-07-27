const { Listener } = require('discord-akairo')

module.exports = class ListenerCooldown extends Listener {
  constructor () {
    super('cooldown', {
      emitter: 'commandHandler',
      event: 'cooldown'
    })
  }

  async exec (message, command, remaining) {
    if (command) {
      const seconds = remaining / 1000.00
      const time = Math.floor(parseFloat(seconds))
      message.custom('⌛', process.env.COLOR_NO, `You can run that command again in **${time}** seconds.`).then(sent => {
        setTimeout(() => {
          sent.delete()
        }, 5000)
      })
    }
  }
}
