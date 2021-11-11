const { Listener } = require('discord-akairo');

module.exports = class ListenerGuildBanAdd extends Listener {
  constructor () {
    super('guildBanAdd', {
      emitter: 'client',
      event: 'guildBanAdd'
    });
  }

  async exec (ban) {
    if (!ban.guild.me.permissions.has(['VIEW_AUDIT_LOG'])) return;
    setTimeout(() => {
      ban.guild.fetchAuditLogs({ type: 'MEMBER_BAN_ADD' }).then(audit => {
        const entry = audit.entries.first();
        if (entry.executor.id === this.client.user.id) return;
        this.client.modcase.create(ban.guild, 'ban', entry.executor.id, ban.user.id, entry.reason);
      });
    }, 2000);
  }
};
