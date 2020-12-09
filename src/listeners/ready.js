const { Listener } = require('discord-akairo')
const chalk = require('chalk')
const { stripIndents } = require('common-tags')

module.exports = class SurferReady extends Listener {
  constructor () {
    super('ready', {
      emitter: 'client',
      event: 'ready'
    })
  }

  async exec () {
    /*
    const activity = async () => {
      const serverSize = this.client.guilds.cache.size === '1' ? `${this.client.guilds.cache.size} server` : `${this.client.guilds.cache.size} servers`
      await this.client.user.setActivity(`${this.client.config.prefix}help | Getting turnt in ${serverSize}.`)
    }
    setInterval(activity, 120000)
    */

    const timestamp = `[${this.client.moment(new Date()).format('YYYY-MM-DD HH:mm:ss')}] `
    console.log(stripIndents`
    ${timestamp}${chalk.black.magenta('[Ready!<3♪]')} It's ya boy, D.J. Tree Fiddy!
    ${timestamp}${this.client.infolog}${this.client.user.tag}
    ${timestamp}${this.client.infolog}Bot ID: ${this.client.user.id}
    ${timestamp}${this.client.infolog}Servers: ${this.client.guilds.cache.size}
    ${timestamp}${this.client.infolog}Channels: ${this.client.channels.cache.size}
    ${timestamp}${this.client.infolog}Users: ${this.client.users.cache.size}
    `)

    // return activity()
  }
}
