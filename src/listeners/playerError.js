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

    if (errsplit.includes('extract') || errsplit.includes('Unsupported')) return message.say('error', 'Not a supported URL or the URL is invalid.', 'Player Error')
    if (errsplit.includes('403')) return message.say('error', 'URL returned HTTP 403 (Forbidden)')
    if (errsplit.includes('416')) return message.say('error', 'Received `Status code: 416 [Range Not Satisfiable]`. This is a weird response. Please try again.', 'Player Error')
    if (errsplit.includes('Cookie')) return message.say('error', 'Cookie header used in the request has expired. The bot owner has been notified about this.', 'Player Error')
    if (errsplit.includes('format')) return message.say('error', 'Cannot find a format of the video to play. The owner of the video has disabled playback on other websites, or the video is unavailable.', 'Player Error')
    if (error.name.includes('Error [VOICE_CONNECTION_TIMEOUT]')) return message.say('error', 'The connection was not established within 15 seconds. Please try again later.', 'Voice Connection Timeout')
    message.say('error', `An unknown error occured:\n\`\`\`js\n${error.name}: ${error.message}\`\`\``, 'Player Error')
    message.recordError('error', 'None', 'Player Error', error.stack)
  }
}
