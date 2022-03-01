const { Listener } = require('discord-akairo');

module.exports = class SurferReady extends Listener {
  constructor () {
    super('ready', {
      emitter: 'client',
      event: 'ready'
    });
  }

  async exec () {
    this.client.logger.info('Logged in as %s (%d)', this.client.user.tag, this.client.user.id);
    this.client.logger.info('[Ready!<3♪] Let\'s party!!');
  }
};
