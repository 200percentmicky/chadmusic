const { Command } = require('discord-akairo');

module.exports = class CommandReverseQueue extends Command {
  constructor () {
    super('reversequeue', {
      aliases: ['reversequeue', 'rq'],
      category: '🎶 Music',
      description: {
        text: 'Reverses the order of the queue.'
      },
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS']
    });
  }

  async exec (message) {
    const djMode = this.client.settings.get(message.guild.id, 'djMode');
    const djRole = this.client.settings.get(message.guild.id, 'djRole');
    const dj = message.member.roles.cache.has(djRole) || message.channel.permissionsFor(message.member.user.id).has(['MANAGE_CHANNELS']);
    if (djMode) {
      if (!dj) return this.client.ui.send(message, 'DJ_MODE');
    }

    const textChannel = this.client.settings.get(message.guild.id, 'textChannel', null);
    if (textChannel) {
      if (textChannel !== message.channel.id) {
        return this.client.ui.send(message, 'WRONG_TEXT_CHANNEL_MUSIC', textChannel);
      }
    }

    const vc = message.member.voice.channel;
    if (!vc) return this.client.ui.send(message, 'NOT_IN_VC');

    const currentVc = this.client.vc.get(vc);
    if (!this.client.player.getQueue(message) || !currentVc) return this.client.ui.send(message, 'NOT_PLAYING');
    else if (vc.id !== currentVc.channel.id) return this.client.ui.send(message, 'ALREADY_SUMMONED_ELSEWHERE');

    if (vc.members.size <= 2 || dj) {
      const queue = this.client.player.getQueue(message);

      /* Slice the original queue */
      const queueLength = queue.songs.length;
      const newQueue = queue.songs.slice(1, queueLength);

      /* Remove the existing elements in the queue */
      queue.songs.splice(1, queueLength);

      /* Reverse the new queue */
      newQueue.reverse();

      /* Finally, push the new queue into the player's queue. */
      Array.prototype.push.apply(queue.songs, newQueue);

      return this.client.ui.reply(message, 'ok', 'The order of the queue has been reversed.');
    } else {
      return this.client.ui.send(message, 'NOT_ALONE');
    }
  }
};
