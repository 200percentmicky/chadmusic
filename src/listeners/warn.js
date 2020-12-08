const { Listener } = require('discord-akairo')

module.exports = class ListenerWarn extends Listener {
  constructor () {
    super('warn', {
      emitter: 'client',
      event: 'warn'
    })
  }

  async exec (warn) {
    const timestamp = `[${this.client.moment(new Date()).format('YYYY-MM-DD HH:mm:ss')}] `
    console.log(timestamp + this.client.warnlog + warn)
  }
}
