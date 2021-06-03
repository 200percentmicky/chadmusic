const { stripIndents } = require('common-tags')
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
    const settings = this.client.settings.get(newMessage.guild.id, 'messageUpdate')
    // var timestamp = `\`[${this.client.moment(new Date()).format('YYYY-MM-DD HH:mm:ss')}]\``;
    if (!settings) return
    const logChannel = this.client.channels.cache.find(val => val.id === settings)
    if (!logChannel) return
    const prefix = this.client.settings.get(newMessage.guild.id, 'prefix')
    if (newMessage.content.toLowerCase().startsWith(prefix)) return

    if (oldMessage.content === newMessage.content) return

    // Embed limitations. Max length in embed.description is 2048 characters.
    let desc = `**Old:** ${oldMessage.content}\n**New:** ${newMessage.content}`
    const msgURLField = desc.length > 2048 ? 'Message too large to view.' : 'Go to Message'
    const msgURLTagline = desc.length > 2048 ? 'Click to see the new message.' : 'Jump!'
    if (desc.length > 2048) desc = `**Old:** ${oldMessage.content}`

    const user = newMessage.member.nickname ? newMessage.member.nickname : newMessage.author.tag
    const edited = new MessageEmbed()
      .setColor(0xDFED1A)
      .setAuthor(`${user}`, newMessage.author.avatarURL())
      .setTitle('📝 Edited Message')
      .setDescription(`${desc}`)
      .addField('Channel', `${newMessage.channel.toString()}`, true)
      .setTimestamp()

    if (desc.length > 2048) {
      edited.addField(`${msgURLField}`, `**[➡ ${msgURLTagline}](https://discord.com/channels/${newMessage.guild.id}/${newMessage.channel.id}/${newMessage.id})**`, true)
    }

    edited.addField('ID', stripIndents`
    \`\`\`js
    Channel: ${newMessage.channel.id}
    Message: ${newMessage.id}
    User: ${newMessage.author.id}
    \`\`\`
    `)

    if (newMessage.channel.id === logChannel) return // Probably a band-aid fix. Inspect further...
    logChannel.send(edited)
  }
}
