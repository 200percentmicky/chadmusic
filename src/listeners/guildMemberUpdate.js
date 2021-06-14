const { Listener } = require('discord-akairo')
const { MessageEmbed } = require('discord.js')
const { stripIndents } = require('common-tags')

module.exports = class ListenerGuildMemberAdd extends Listener {
  constructor () {
    super('guildMemberUpdate', {
      emitter: 'client',
      event: 'guildMemberUpdate'
    })
  }

  exec (oldMember, newMember) {
    const settings = this.client.settings.get(newMember.guild.id, 'guildMemberUpdate')
    if (!settings) return
    // var timestamp = `\`[${this.client.moment(new Date()).format('YYYY-MM-DD HH:mm:ss')}]\``;
    const memberLogChannel = this.client.channels.cache.find(val => val.id === settings)
    if (!memberLogChannel) return
    // 33C5FF
    // Nickname Change
    if (newMember.nickname !== oldMember.nickname) {
      const nickname = new MessageEmbed()
        .setColor(0xF29500)
        .setAuthor(newMember.user.tag, newMember.user.avatarURL())
        .setTitle('📛 Nickname Change')
        .setDescription(`**Before:** ${oldMember.nickname !== null ? oldMember.nickname : 'None'}\n**After:** ${newMember.nickname !== null ? newMember.nickname : 'None'}`)
        .addField('ID', stripIndents`
        \`\`\`js
        User: ${newMember.user.id}
        \`\`\`
        `)
        .setTimestamp()
      memberLogChannel.send({ embed: nickname })
    }

    // TODO: Add more info from guildMemberUpdate
  }
}
