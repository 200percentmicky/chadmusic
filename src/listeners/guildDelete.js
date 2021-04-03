const { Listener } = require('discord-akairo')

module.exports = class ListenerGuildDelete extends Listener {
  constructor () {
    super('guildDelete', {
      emitter: 'client',
      event: 'guildDelete'
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

    // ! Watch for memory usage.

    await this.client.djMode.delete(guild.id) // DJ Mode
    await this.client.djRole.delete(guild.id) // DJ Role
    await this.client.allowFreeVolume.delete(guild.id) // Unlimited Volume
    await this.client.nowPlayingAlerts.delete(guild.id) // Now Playing Alerts
    await this.client.maxTime.delete(guild.id) // Max Time
    await this.client.maxQueueLimit.delete(guild.id) // Max Queue Limit
    await this.client.textChannel.delete(guild.id) // Text Channel
    await this.client.voiceChannel.delete(guild.id) // Voice Channel
  }
}
