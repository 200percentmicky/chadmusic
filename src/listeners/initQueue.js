const { Listener } = require('discord-akairo');

module.exports = class ListenerInitQueue extends Listener {
  constructor () {
    super('initQueue', {
      emitter: 'player',
      event: 'initQueue'
    });
  }

  async exec (queue) {
    const guild = queue.textChannel.guild;
    const volume = this.client.settings.get(guild.id, 'defaultVolume', 100);

    queue.autoplay = false;
    queue.volume = parseInt(volume);
  }
};
