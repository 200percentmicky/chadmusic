const { Listener } = require('discord-akairo')

module.exports = class ListenerCommandError extends Listener {
  constructor () {
    super('commandError', {
      emitter: 'commandHandler',
      event: 'error'
    })
  }

  async exec (error, message, command) {
    message.channel.send(`💢 \`Bruh Moment in command '${command.id}'. An error report was sent to the bot owner.\``)
    message.recordError('error', command, 'Command Error', error.stack)
  }
}
