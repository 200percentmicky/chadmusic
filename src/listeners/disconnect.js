const { Listener } = require('discord-akairo');

module.exports = class ListenerDisconnect extends Listener {
  constructor () {
    super('disconnect', {
      emitter: 'player',
      event: 'disconnect'
    });
  }

  async exec (queue) {
    queue.textChannel.send('Well, something happened. Try again, maybe?');
  }
};
