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
    const activity = async () => {
      const serverSize = guilds === '1' ? '1 server' : `${guilds} servers`
      this.client.user.setActivity(`;help or ${process.env.PREFIX}help | Surfing in ${serverSize}.`)
    }
    setInterval(activity, 120000)

    const owner = this.client.users.cache.get(process.env.OWNER_ID)
    const channels = this.client.channels.cache.size
    const users = this.client.users.cache.size

    this.client.logger.info('[Ready!<3♪] Let\'s party!!')
    this.client.logger.info('Client: %s (%d)', this.client.user.tag, this.client.user.id)
    this.client.logger.info('Owner: %s (%d)', owner.tag, owner.id)
    this.client.logger.info('Currently surfing with %s concurrent users.', users)
    this.client.logger.info('I can see %s server(s) with %d channels I have access to.', guilds, channels)

    return activity()
  }
}
