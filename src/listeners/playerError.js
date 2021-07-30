const { Listener } = require('discord-akairo')

module.exports = class ListenerPlayerError extends Listener {
  constructor () {
    super('playerError', {
      emitter: 'player',
      event: 'error'
    })
  }

  async exec (channel, error) {
    const message = channel.messages.cache.find(msg => msg)
    const errsplit = error.message.split(/ +/g)

    if (errsplit.includes('extract') || errsplit.includes('Unsupported')) return this.client.ui.say(message, 'error', 'Not a supported URL or the URL is invalid.', 'Player Error')
    if (errsplit.includes('403')) return this.client.ui.say(message, 'error', 'URL returned HTTP 403 (Forbidden)')
    if (errsplit.includes('416')) return this.client.ui.say(message, 'error', 'Received `Status code: 416 [Range Not Satisfiable]`. This is a weird response. Please try again.', 'Player Error')
    if (errsplit.includes('Cookie')) return this.client.ui.say(message, 'error', 'Cookie header used in the request has expired. The bot owner has been notified about this.', 'Player Error')
    if (errsplit.includes('format')) return this.client.ui.say(message, 'error', 'Cannot find a format of the video to play. The owner of the video has disabled playback on other websites, or the video is unavailable.', 'Player Error')
    if (error.name.includes('Error [VOICE_CONNECTION_TIMEOUT]')) return this.client.ui.say(message, 'error', 'The connection was not established within 15 seconds. Please try again later.', 'Voice Connection Timeout')
    this.client.ui.say(message, 'error', `An unknown error occured:\n\`\`\`js\n${error.name}: ${error.message}\`\`\``, 'Player Error')
    message.recordError('error', 'None', 'Player Error', error.stack)
  }
}
