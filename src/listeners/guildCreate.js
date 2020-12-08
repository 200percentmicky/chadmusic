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

    /*
    let channel = guild.channels.cache.get(guild.systemChannelID)
    if (!channel) channel = guild.channels.cache.first()

    // Just in case guildCreate is continuously called, which is
    // has in the past.
    if (!this.client.joined.has(guild.id)) {
      this.client.joined.set(guild.id, true)
      if (channel.type !== 'text') return
      return channel.send(new MessageEmbed()
        .setColor(this.client.color.ok)
        .setAuthor('Thank you for inviting me to your server!')
        .setDescription(stripIndents`
        - My prefix is \`${this.client.config.prefix}\`
        - Type \`${this.client.config.prefix}play\` to get this party started!
        - Type \`${this.client.config.prefix}help\` to get my full list of commands.
        - Join the [support server](${this.client.config.invite}) if you need assistance with the bot.
        - Have fun and enjoy!
        `)
        .setFooter('Deejay - The Chad Music Bot.', this.client.user.avatarURL({ dynamic: true }))
      )
    }
    */
  }
}
