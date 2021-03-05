const { Listener } = require('discord-akairo')
const { MessageEmbed } = require('discord.js')

module.exports = class ListenerMessageDelete extends Listener {
  constructor () {
    super('messageDelete', {
      emitter: 'client',
      event: 'messageDelete'
    })
  }

  async exec (message) {
    if (message.author.bot) return
    if (message.channel.type === 'dm') return
    const settings = this.client.settings.get(message.guild.id)
    if (!settings) return
    const logChannel = this.client.channels.cache.find(val => val.id === settings.messageDelete)
    if (!logChannel) return
    if (message.content.toLowerCase().startsWith(this.client.config.prefix)) return

    const user = message.member.nickname ? message.member.nickname : message.author.tag
    const deleted = new MessageEmbed()
      .setColor(0x9C0003)
      .setAuthor(user, message.author.avatarURL())
      .setDescription(message.content)
      .addField('Channel', message.channel.toString(), true)
      .setTimestamp()
      .setFooter('Message Deleted')

    if (message.system) return

    await message.guild.fetchAuditLogs({ type: 'MESSAGE_DELETE' }).then(audit => {
      const x = audit.entries.first()
      if (message.author) return
      if (audit) deleted.addField('Moderator', x.executor.toString(), true)
    })
    if (message.channel.id === logChannel) return // Again, a band-aid fix. Same as messageUpdate.js.
    logChannel.send(`🗑 **${message.author.username}**#${message.author.discriminator} (\`${message.author.id}\`)'s message has been deleted in ${message.channel.toString()}.`, deleted)
  }
}
