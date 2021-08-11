const { Listener } = require('discord-akairo')

module.exports = class ListenerGuildBanRemove extends Listener {
  constructor () {
    super('guildBanRemove', {
      emitter: 'client',
      event: 'guildBanRemove'
    })
  }

  exec (ban) {
    if (!ban.guild.me.permissions.has(['VIEW_AUDIT_LOG'])) return
    ban.guild.fetchAuditLogs({ type: 'MEMBER_BAN_REMOVE' }).then(audit => {
      const entry = audit.entries.first()
      if (entry.executor.id === this.client.user.id) return
      ban.guild.recordCase('unban', entry.executor.id, ban.user.id, entry.reason)
    })
  }
}
