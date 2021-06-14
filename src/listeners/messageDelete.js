const { stripIndents } = require('common-tags')
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
    const settings = this.client.settings.get(message.guild.id, 'messageDelete')
    if (!settings) return
    const logChannel = this.client.channels.cache.find(val => val.id === settings)
    if (!logChannel) return
    const prefix = this.client.settings.get(message.guild.id, 'prefix')
    if (message.content.toLowerCase().startsWith(prefix)) return

    const deleted = new MessageEmbed()
      .setColor(0x9C0003)
      .setAuthor(`${message.author.tag}`, message.author.avatarURL())
      .setTitle('🗑 Message Deleted')
      .setDescription(`${message.content}`)
      .addField('Channel', `${message.channel.toString()}`, true)
      .addField('ID', stripIndents`
      \`\`\`js
      Channel: ${message.channel.id}
      Message: ${message.id}
      User: ${message.author.id}
      \`\`\`
      `)
      .setTimestamp()

    if (message.system) return

    await message.guild.fetchAuditLogs({ type: 'MESSAGE_DELETE' }).then(audit => {
      const x = audit.entries.first()
      if (message.author) return
      if (audit) deleted.addField('Moderator', `${x.executor.toString()}`, true)
    })
    if (message.channel.id === logChannel) return // Again, a band-aid fix. Same as messageUpdate.js.
    logChannel.send({ embed: deleted })
  }
}
