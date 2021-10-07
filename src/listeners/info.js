const { Listener } = require('discord-akairo');

module.exports = class ListenerInfo extends Listener {
  constructor () {
    super('info', {
      emitter: 'client',
      event: 'info'
    });
  }

  async exec (info) {
    this.client.logger.info(info);
  }
};
