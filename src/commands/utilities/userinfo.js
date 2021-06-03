const { Command } = require('discord-akairo')
const { MessageEmbed } = require('discord.js')

module.exports = class CommandUserInfo extends Command {
  constructor () {
    super('userinfo', {
      aliases: ['userinfo', 'ui'],
      channelRestriction: 'guild',
      category: '⚙ Utilities',
      clientPermissions: ['EMBED_LINKS'],
      description: {
        text: 'Get information on a member.',
        usage: '[@user]'
      }
    })
  }

  async exec (message) {
    const args = message.content.split(/ +/g)
    let member = message.mentions.members.first() || message.guild.members.cache.get(args[1])
    if (!args[1] || !member) member = message.member
    const guildTimestamp = member.joinedTimestamp
    const platformTimestamp = member.user.createdTimestamp
    const joinServer = `${this.client.moment(guildTimestamp).format('LLLL')}\n${this.client.moment(guildTimestamp).fromNow()}`
    const joinPlatform = `${this.client.moment(platformTimestamp).format('LLLL')}\n${this.client.moment(platformTimestamp).fromNow()}`
    const serverRoles = member.roles.cache.map(roles => `${roles}`).join(' ')
    const onlineStatus = {
      online: '💚 **Online**',
      idle: '☕ **Idle**',
      dnd: '⛔ **Do Not Disturb**',
      offline: '🌙 **Offline**'
    }
    const whatDevice = {
      web: '🌎',
      mobile: '📱',
      desktop: '💻'
    }
    const userOnlineDeviceStatus = member.user.presence.clientStatus
    const userOnlineStatus = member.user.presence.status

    const embed = new MessageEmbed()
      .setColor(member.displayColor)
      .setAuthor(member.user.tag, member.user.avatarURL({ dynamic: true }))
      .setTitle(`🆔 \`${member.user.id}\``)
      .setDescription(`${userOnlineDeviceStatus !== null ? `${whatDevice[Object.keys(userOnlineDeviceStatus)]} ${onlineStatus[userOnlineStatus]}` : onlineStatus[userOnlineStatus]} ${member.user.toString()}`)
      .setThumbnail(member.user.avatarURL({ dynamic: true }) + '?size=1024')
      .addField('📥 Joined Server:', `${joinServer}`)
      .addField('✨ Account Created:', `${joinPlatform}`, true)
      .addField('🤖 Bot Account?', `${member.user.bot ? 'Yes' : 'No'}`, true)
      .addField('🏷 Server Roles:', `${serverRoles}`)
    return message.channel.send(embed)
  }
}
