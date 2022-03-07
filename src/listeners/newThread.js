const { Listener } = require('discord-akairo');

module.exports = class ListenerThreadCreate extends Listener {
  constructor () {
    super('threadCreate', {
      emitter: 'client',
      event: 'threadCreate'
    });
  }

  async exec (thread) {
    await thread.join();
  }
};
