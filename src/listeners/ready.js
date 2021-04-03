const { Listener } = require('discord-akairo')

module.exports = class SurferReady extends Listener {
  constructor () {
    super('ready', {
      emitter: 'client',
      event: 'ready'
    })
  }

  async exec () {
    // In the case that the client is Poki#7585, the following commands
    // will be disabled to avoid conflict, and the activity will not
    // be applied when the client is ready.
    if (this.client.user.id === '375450533114413056') {
      const aliases = require('../aliases.json')
      this.client.commands.remove(aliases.invite[0] || 'invite')

      this.client.logger.info('[Ready!<3♪] Let\'s party!!')
      this.client.logger.info('Client: %s (%d)', this.client.user.tag, this.client.user.id)
    } else {
      const activity = async () => {
        const serverSize = this.client.guilds.cache.size === '1' ? `${this.client.guilds.cache.size} server` : `${this.client.guilds.cache.size} servers`
        await this.client.user.setActivity(`${process.env.PREFIX}help | Getting turnt in ${serverSize}.`)
      }
      setInterval(activity, 120000)

      this.client.logger.info('[Ready!<3♪] Let\'s party!!')
      this.client.logger.info('Client: %s (%d)', this.client.user.tag, this.client.user.id)

      return activity()
    }
  }
}
