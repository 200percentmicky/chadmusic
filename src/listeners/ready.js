const { Listener } = require('discord-akairo')

module.exports = class SurferReady extends Listener {
  constructor () {
    super('ready', {
      emitter: 'client',
      event: 'ready'
    })
  }

  async exec () {
    const activity = async () => {
      const serverSize = this.client.guilds.cache.size === '1' ? '1 server' : `${this.client.guilds.cache.size} servers`
      this.client.user.setActivity(`;help or ${process.env.PREFIX}help | Surfing in ${serverSize}.`)
    }
    setInterval(activity, 120000)

    this.client.logger.info('[Ready!<3♪] Let\'s party!!')
    this.client.logger.info('Client: %s (%d)', this.client.user.tag, this.client.user.id)

    return activity()
  }
}
