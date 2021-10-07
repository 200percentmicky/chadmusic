const { Listener } = require('discord-akairo');

module.exports = class ListenerGuildBlocklist extends Listener {
  constructor () {
    super('guildBlocklist', {
      emitter: 'client',
      event: 'messageCreate'
    });
  }

  async exec (message) {
    return;
    const guildBlocklist = await this.client.blocklist.get('guild');
    if (guildBlocklist == null) this.client.blocklist.set('guild', []);
    if (guildBlocklist.includes(message.guild.id)) {
      message.guild.leave();
      this.client.logger.warn('Left blacklisted guild: %s', message.guild.id);
    }
  }
};
