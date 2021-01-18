// const { stripIndents } = require('common-tags')
const { Listener } = require('discord-akairo')
// const { MessageEmbed } = require('discord.js')

module.exports = class ListenerGuildCreate extends Listener {
  constructor () {
    super('guildCreate', {
      emitter: 'client',
      event: 'guildCreate'
    })
  }

  async exec (guild) {
    const defaults = {
      djMode: false,
      djRole: null,
      allowFreeVolume: true,
      nowPlayingAlerts: true,
      maxTime: null,
      maxQueueLimit: null
    }

    await this.client.settings.ensure(guild.id, defaults)
  }
}
