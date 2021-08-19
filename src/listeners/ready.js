const { Listener } = require('discord-akairo')

module.exports = class SurferReady extends Listener {
  constructor () {
    super('ready', {
      emitter: 'client',
      event: 'ready'
    })
  }

  async exec () {
    const guilds = this.client.guilds.cache.size
    const owner = this.client.users.cache.get(process.env.OWNER_ID)
    const channels = this.client.channels.cache.size
    const users = this.client.users.cache.size

    // This is specific for my bot. It'll have no affect on your own.
    if (process.env.IS_POKI === 'true') {
      this.client.commands.remove('invite')
    }

    // Disables eval if DEV is set to false.
    if (process.env.DEV === 'true') {
      this.client.commands.remove('meval')
    }

    this.client.logger.info('Logged in as %s (%d)', this.client.user.tag, this.client.user.id)
    this.client.logger.info('The owner of this application is %s (%d)', owner.tag, owner.id)
    this.client.logger.info('I can see %s server(s) with %d channels I have access to.', guilds, channels)
    this.client.logger.info('Currently surfing with %s concurrent users.', users)

    this.client.logger.info('[Ready!<3♪] Let\'s party!!')
  }
}
