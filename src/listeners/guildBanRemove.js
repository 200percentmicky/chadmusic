const { Listener } = require('discord-akairo')

module.exports = class ListenerGuildBanRemove extends Listener {
  constructor () {
    super('guildBanRemove', {
      emitter: 'client',
      event: 'guildBanRemove'
    })
  }

  exec (guild, user) {
    return
    const settings = this.client.settings.get(guild.id)
    if (!settings) return
    // var timestamp = `\`[${this.client.moment(new Date()).format('YYYY-MM-DD HH:mm:ss')}]\``;
    const modLogChannel = this.client.channels.cache.find(val => val.id === settings.modlog)
    if (!modLogChannel) return

    guild.fetchAuditLogs({ type: 'MEMBER_BAN_REMOVE' }).then(audit => {
      const entry = audit.entries.first()
      if (entry.executor.id === this.client.user.id) return
      guild.recordCase('unban', entry.executor.id, user.id, entry.reason)
    })
  }
}
