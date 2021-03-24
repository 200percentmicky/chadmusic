const { Listener } = require('discord-akairo')

module.exports = class ListenerGuildCreate extends Listener {
  constructor () {
    super('guildCreate', {
      emitter: 'client',
      event: 'guildCreate'
    })
  }

  async exec (guild) {
    /* Client Defaults */
    /*
    djMode: false,
    djRole: null,
    allowFreeVolume: true,
    nowPlayingAlerts: true,
    maxTime: null,
    maxQueueLimit: null,
    textChannel: null,
    voiceChannel: null
    */

    await this.client.djMode.set(guild.id, false) // DJ Mode
    await this.client.allowFreeVolume.set(guild.id, true) // Unlimited Volume
    await this.client.nowPlayingAlerts.set(guild.id, true) // Now Playing Alerts
  }
}
