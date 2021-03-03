const { Listener } = require('discord-akairo')
const { MessageEmbed } = require('discord.js')

module.exports = class ListenerMessageUpdate extends Listener {
  constructor () {
    super('messageUpdate', {
      emitter: 'client',
      event: 'messageUpdate'
    })
  }

  exec (oldMessage, newMessage) {
    if (newMessage.channel.type === 'dm') return
    if (newMessage.author.bot) return
    const settings = this.client.settings.get(newMessage.guild.id)
    // var timestamp = `\`[${this.client.moment(new Date()).format('YYYY-MM-DD HH:mm:ss')}]\``;
    if (!settings) return
    const logChannel = this.client.channels.cache.find(val => val.id === settings.messageUpdate)
    if (!logChannel) return
    if (newMessage.content.toLowerCase().startsWith(this.client.config.prefix)) return

    if (oldMessage.content === newMessage.content) return

    // Embed limitations. Max length in embed.description is 2048 characters.
    let desc = `**Old:** ${oldMessage.content}\n**New:** ${newMessage.content}`
    const msgURLField = desc.length > 2048 ? 'Message too large to view.' : 'Go to Message'
    const msgURLTagline = desc.length > 2048 ? 'Click to see the new message.' : 'Jump!'
    if (desc.length > 2048) desc = `**Old:** ${oldMessage.content}`

    const user = newMessage.member.nickname ? newMessage.member.nickname : newMessage.author.tag
    const edited = new MessageEmbed()
      .setColor(0xDFED1A)
      .setAuthor(user, newMessage.author.avatarURL())
      .setDescription(desc)
      .addField('Channel', newMessage.channel.toString(), true)
      .setTimestamp()
      .setFooter('Message Edited')

    if (desc.length > 2048) {
      edited.addField(msgURLField, `**[➡ ${msgURLTagline}](https://discord.com/channels/${newMessage.guild.id}/${newMessage.channel.id}/${newMessage.id})**`, true)
    }

    if (newMessage.channel.id === logChannel) return // Probably a band-aid fix. Inspect further...
    logChannel.send(`✏ **${newMessage.author.tag}** (\`${newMessage.author.id}\`) updated their message in ${newMessage.channel.toString()}.`, edited)
  }
}
