const { Listener } = require('discord-akairo')
const { MessageEmbed } = require('discord.js')

module.exports = class ListenerGuildMemberAdd extends Listener {
  constructor () {
    super('guildMemberAdd', {
      emitter: 'client',
      event: 'guildMemberAdd'
    })
  }

  exec (member) {
    const settings = this.client.settings.get(member.guild.id)
    if (!settings) return
    // var timestamp = `\`[${this.client.moment(new Date()).format('YYYY-MM-DD HH:mm:ss')}]\``;
    const memberLogChannel = this.client.channels.cache.find(val => val.id === settings.guildMemberAdd)
    if (!memberLogChannel) return

    const join = new MessageEmbed()
      .setColor(0x77B255)
      .setAuthor(member.user.tag, member.user.avatarURL())
      .setTitle(`\`${member.user.id}\``)
      .setDescription(`${member.user.toString()}\n${member.user.bot ? '**🤖 Bot Account**' : ''}`)
      .addField('Total Members', member.guild.memberCount)
      .setThumbnail(member.user.avatarURL() + '?size=2048')
      .setTimestamp()
      .setFooter('Member Joined')
    memberLogChannel.send(`📥 **${member.user.tag}** (\`${member.user.id}\`) joined the server.`, join)
  }
}
