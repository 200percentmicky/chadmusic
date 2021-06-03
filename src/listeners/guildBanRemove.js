const { Listener } = require('discord-akairo')

module.exports = class ListenerGuildBanRemove extends Listener {
  constructor () {
    super('guildBanRemove', {
      emitter: 'client',
      event: 'guildBanRemove'
    })
  }

  exec (guild, user) {
    guild.fetchAuditLogs({ type: 'MEMBER_BAN_REMOVE' }).then(audit => {
      const entry = audit.entries.first()
      if (entry.executor.id === this.client.user.id) return
      guild.recordCase('unban', entry.executor.id, user.id, entry.reason)
    })
  }
}
