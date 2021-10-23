const { Listener } = require('discord-akairo');
const { Permissions } = require('discord.js');

module.exports = class ListenerAddList extends Listener {
  constructor () {
    super('addList', {
      emitter: 'player',
      event: 'addList'
    });
  }

  async exec (queue, playlist) {
    const channel = queue.textChannel;
    const member = channel.guild.members.cache.get(queue.songs[queue.songs.length - 1].user.id);
    const prefix = this.client.settings.get(channel.guild.id, 'prefix', process.env.PREFIX);

    // Assume that the last message from this member contains
    // the prefix for the server, and one of the commands is
    // either "play" or "playnow".
    const message = channel.messages.cache.filter(x => x.author.id === member.user.id && x.content.startsWith(`${prefix}p`)).last();

    // Cut some or many entries if maxQueueLimit is in place.
    const djRole = this.client.settings.get(channel.guild.id, 'djRole');
    const dj = member.roles.cache.has(djRole) || channel.permissionsFor(member.user.id).has(Permissions.FLAGS.MANAGE_CHANNELS);
    if (!dj) {
      const maxQueueLimit = this.client.settings.get(channel.guild.id, 'maxQueueLimit');
      if (maxQueueLimit) {
        const queueLength = queue.songs.length - playlist.songs.length; // The length before the playlist was added.
        const allowedLimit = queueLength + maxQueueLimit; // The result of the added playlist if maxQueueLimit is in place.

        // The queue has the currently playing song as the first element
        // in the array, so we don't need to subtract the number to get
        // the correct element.
        queue.songs.splice(allowedLimit, playlist.songs.length - maxQueueLimit);
        return this.client.ui.say(message, 'ok', `${playlist.user} added the playlist **${playlist.name}** with **${playlist.songs.length}** entr${playlist.songs.length === 1 ? 'y' : 'ies'}. However, only the first ${maxQueueLimit > 1 ? `${maxQueueLimit} entries` : 'entry'} was added due to queue limits on this server.`);
      }
    }

    this.client.ui.say(message, 'ok', `${playlist.user} added the playlist **${playlist.name}** with **${playlist.songs.length}** entr${playlist.songs.length === 1 ? 'y' : 'ies'} to the queue.`);
  }
};
