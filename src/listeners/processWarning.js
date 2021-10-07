const { Listener } = require('discord-akairo');

module.exports = class ListenerProcessWarning extends Listener {
  constructor () {
    super('processWarning', {
      emitter: 'process',
      event: 'warning'
    });
  }

  async exec (warning) {
    this.client.logger.warn('[process] %s: %s', warning.name, warning.message);
  }
};
