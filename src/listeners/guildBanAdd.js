const { Listener } = require('discord-akairo')

module.exports = class ListenerGuildBanAdd extends Listener {
  constructor () {
    super('guildBanAdd', {
      emitter: 'client',
      event: 'guildBanAdd'
    })
  }

  async exec (guild, user) {
    guild.fetchAuditLogs({ type: 'MEMBER_BAN_ADD' }).then(audit => {
      const entry = audit.entries.first()
      if (entry.executor.id === this.client.user.id) return
      guild.recordCase('ban', entry.executor.id, user.id, entry.reason)
    })
  }
}
