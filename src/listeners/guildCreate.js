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
    await this.client.settings.ensure(guild.id, this.client.defaults)
  }
}
