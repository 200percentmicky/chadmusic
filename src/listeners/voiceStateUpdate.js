const { Listener } = require('discord-akairo')
const { MessageEmbed } = require('discord.js')

module.exports = class ListenerVoiceStateUpdate extends Listener {
  constructor () {
    super('voiceStateUpdate', {
      emitter: 'client',
      event: 'voiceStateUpdate'
    })
  }

  async exec (oldState, newState) {
    const settings = this.client.settings.get(newState.guild.id)
    if (!settings) return
    // var timestamp = `\`[${this.client.moment(new Date()).format('YYYY-MM-DD HH:mm:ss')}]\``;
    const voiceLogChannel = this.client.channels.cache.find(val => val.id === settings.voiceStateUpdate)
    if (!voiceLogChannel) return

    const user = newState.member.nickname ? newState.member.nickname : newState.member.user.tag

    if (!oldState.channel) {
      return voiceLogChannel.send(`🔊 ✅ **${newState.member.user.username}**#${newState.member.user.discriminator} (\`${newState.member.user.id}\`) joined \`${newState.channel.name}\`.`, new MessageEmbed()
        .setColor(0x78B159)
        .setAuthor(user, newState.member.user.avatarURL({ dynamic: true }))
        .setDescription(`**Joined:** ${newState.channel.name}`)
        .setTimestamp()
        .setFooter('Joined Voice Channel')
      )
    }

    if (!newState.channel) {
      const embed = new MessageEmbed()
        .setColor(0xDD2E44)
        .setAuthor(user, newState.member.user.avatarURL({ dynamic: true }))
        .setDescription(`**Left:** ${oldState.channel.name}`)
        .setTimestamp()
        .setFooter('Left Voice Channel')
      return voiceLogChannel.send(`🔊 ❌ **${newState.member.user.username}**#${newState.member.user.discriminator} (\`${newState.member.user.id}\`) left \`${oldState.channel.name}\`.`, embed)
    }

    const audit = await newState.guild.fetchAuditLogs({ type: 'MEMBER_MOVE' })
    const x = audit.entries.first()
    if (x.executor.id !== newState.member.user.id) {
      const embed = new MessageEmbed()
        .setColor(0xFFCC4D)
        .setAuthor(user, newState.member.user.avatarURL({ dynamic: true }))
        .setDescription(`${oldState.channel.name} 👌 ${newState.channel.name}`)
        .setTimestamp()
        .setFooter('VC User Moved')
      return voiceLogChannel.send(`🔊 👌 **${x.executor.username}**#${x.executor.discriminator} (\`${x.executor.id}\`) moved **${newState.member.user.username}**#${newState.member.user.discriminator} (\`${newState.member.user.id}\`) from \`${oldState.channel.name}\` to \`${newState.channel.name}\`.`, embed)
    } else {
      if (oldState.channel !== newState.channel) {
        const embed = new MessageEmbed()
          .setColor(0x55ACEE)
          .setAuthor(user, newState.member.user.avatarURL({ dynamic: true }))
          .setDescription(`${oldState.channel.name} 🡆 ${newState.channel.name}`)
          .setTimestamp()
          .setFooter('Moved Voice Channels')
        return voiceLogChannel.send(`🔊 ↗ **${newState.member.user.username}**#${newState.member.user.discriminator} (\`${newState.member.user.id}\`) moved from \`${oldState.channel.name}\` to \`${newState.channel.name}\`.`, embed)
      }
    }
  }
}
