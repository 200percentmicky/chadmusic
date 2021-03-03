const { Listener } = require('discord-akairo')
const { MessageEmbed } = require('discord.js')

module.exports = class ListenerGuildMemberAdd extends Listener {
  constructor () {
    super('guildMemberUpdate', {
      emitter: 'client',
      event: 'guildMemberUpdate'
    })
  }

  exec (oldMember, newMember) {
    const settings = this.client.settings.get(newMember.guild.id)
    if (!settings) return
    // var timestamp = `\`[${this.client.moment(new Date()).format('YYYY-MM-DD HH:mm:ss')}]\``;
    const memberLogChannel = this.client.channels.cache.find(val => val.id === settings.guildMemberUpdate)
    if (!memberLogChannel) return
    // 33C5FF
    // Nickname Change
    if (newMember.nickname !== oldMember.nickname) {
      const nickname = new MessageEmbed()
        .setColor(0xF29500)
        .setAuthor(newMember.user.tag, newMember.user.avatarURL())
        .setTitle(`\`${newMember.user.id}\``)
        .setDescription(`**Before:** ${oldMember.nickname !== null ? oldMember.nickname : 'None'}\n**After:** ${newMember.nickname !== null ? newMember.nickname : 'None'}`)
        .setTimestamp()
      memberLogChannel.send(`📛 **${newMember.user.tag}** (\`${newMember.user.id}\`) changed their nickname.`, nickname)
    }

    // TODO: Username and Discriminator updates
  }
}
