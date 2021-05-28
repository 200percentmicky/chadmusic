const { stripIndents } = require('common-tags')
const { Listener } = require('discord-akairo')
const { MessageEmbed } = require('discord.js')

module.exports = class ListenerGuildMemberAdd extends Listener {
  constructor () {
    super('guildMemberRemove', {
      emitter: 'client',
      event: 'guildMemberRemove'
    })
  }

  async exec (member) {
    const settings = this.client.settings.get(member.guild.id, 'guildMemberRemove')
    if (!settings) return
    // var timestamp = `\`[${this.client.moment(new Date()).format('YYYY-MM-DD HH:mm:ss')}]\``;
    const memberLogChannel = this.client.channels.cache.find(val => val.id === settings)
    if (!memberLogChannel) return

    const left = new MessageEmbed()
      .setColor(0xDE2A42)
      .setAuthor(member.user.tag, member.user.avatarURL())
      .setTitle('📤 User Left')
      .setDescription(`${member.user.bot ? '🤖 Bot Account' : ''}`)
      .addField('Total Members', member.guild.memberCount)
      .addField('ID', stripIndents`
      \`\`\`js
      User: ${member.user.id}
      \`\`\`
      `)
      .setThumbnail(member.user.avatarURL() + '?size=2048')
      .setTimestamp()
    memberLogChannel.send(left)
  }
}
