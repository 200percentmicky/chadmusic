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
      const serverSize = this.client.guilds.cache.size === '1' ? `${this.client.guilds.cache.size} server` : `${this.client.guilds.cache.size} servers`
      await this.client.user.setActivity(`${this.client.config.prefix}help | Getting turnt in ${serverSize}.`)
    }
    setInterval(activity, 120000)

    this.client.logger.info('[Ready!<3♪] It\'s ya boy, D.J. Tree Fiddy!')
    this.client.logger.info('Client: %s (%d)', this.client.user.tag, this.client.user.id)

    return activity()
  }
}
