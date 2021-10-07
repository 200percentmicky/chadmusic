const { Listener } = require('discord-akairo');

module.exports = class ListenerWarn extends Listener {
  constructor () {
    super('warn', {
      emitter: 'client',
      event: 'warn'
    });
  }

  async exec (warn) {
    this.client.logger.warn(warn);
  }
};
