const { Listener } = require('discord-akairo')

module.exports = class ListenerCooldown extends Listener {
  constructor () {
    super('cooldown', {
      emitter: 'commandHandler',
      event: 'commandCooldown'
    })
  }

  async exec (message, command, remaining) {
    if (command) {
      const seconds = remaining / 1000.00
      const time = parseFloat(seconds).toFixed(2)
      message.say(`Slow down, ${message.author.toString()}! Try again in **${time}** seconds.`, null, process.env.COLOR_NO, '⏳').then(sent => {
        setTimeout(() => {
          sent.delete()
        }, 5000)
      })
    }
  }
}
