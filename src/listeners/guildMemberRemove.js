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
    const settings = this.client.settings.get(member.guild.id)
    if (!settings) return
    // var timestamp = `\`[${this.client.moment(new Date()).format('YYYY-MM-DD HH:mm:ss')}]\``;
    const memberLogChannel = this.client.channels.cache.find(val => val.id === settings.guildMemberRemove)
    if (!memberLogChannel) return

    const left = new MessageEmbed()
      .setColor(0xDE2A42)
      .setAuthor(member.user.tag, member.user.avatarURL())
      .setTitle(`\`${member.user.id}\``)
      .setDescription(`${member.user.bot ? '🤖 Bot Account' : ''}`)
      .addField('Total Members', member.guild.memberCount)
      .setThumbnail(member.user.avatarURL() + '?size=2048')
      .setTimestamp()
      .setFooter('Member left or was kicked.')
    memberLogChannel.send(`📤 **${member.user.username}**#${member.user.discriminator} (\`${member.user.id}\`) left or was kicked from the server.`, left)
  }
}
