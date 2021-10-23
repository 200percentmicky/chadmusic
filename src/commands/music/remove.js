const { Command } = require('discord-akairo');

module.exports = class CommandRemove extends Command {
  constructor () {
    super('remove', {
      aliases: ['remove', 'removesong'],
      category: '🎶 Music',
      description: {
        text: 'Removes an entry or multiple entries from the queue.',
        usage: '<int:queue_entry/start> [int:end]',
        details: '`<int:queue_entry/starting>` The queue entry to remove from the queue, or the starting position.\n[int:end] The end position for removing multiple entries.\nEvery entry from the starting to end position will be removed from the queue.'
      },
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS']
    });
  }

  async exec (message) {
    const args = message.content.split(/ +/g);
    const djMode = this.client.settings.get(message.guild.id, 'djMode');
    const djRole = this.client.settings.get(message.guild.id, 'djRole');
    const dj = message.member.roles.cache.has(djRole) || message.channel.permissionsFor(message.member.user.id).has(['MANAGE_CHANNELS']);
    if (djMode) {
      if (!dj) return this.client.ui.reply(message, 'no', 'DJ Mode is currently active. You must have the DJ Role or the **Manage Channels** permission to use music commands at this time.', 'DJ Mode');
    }

    const textChannel = this.client.settings.get(message.guild.id, 'textChannel', null);
    if (textChannel) {
      if (textChannel !== message.channel.id) {
        return this.client.ui.reply(message, 'no', `Music commands must be used in <#${textChannel}>.`);
      }
    }

    const vc = message.member.voice.channel;
    if (!vc) return this.client.ui.reply(message, 'error', 'You are not in a voice channel.');

    const currentVc = this.client.vc.get(vc);
    if (!this.client.player.getQueue(message) || !currentVc) return this.client.ui.say(message, 'warn', 'Nothing is currently playing in this server.');
    else if (vc.id !== currentVc.channel.id) return this.client.ui.reply(message, 'error', 'You must be in the same voice channel that I\'m in to use that command.');

    if (!args[1]) return this.client.ui.usage(message, 'remove <int:queue_entry/starting> [int:end]');

    if (vc.members.size <= 2 || dj) {
      const queue = this.client.player.getQueue(message);

      /* Remove multiple entries from the queue. */
      if (args[2]) {
        /* Parsing arguments as numbers */
        const start = parseInt(args[1]);
        const end = parseInt(args[2]);

        /* Checking if the arguments are numbers. */
        if (isNaN(start)) return this.client.ui.reply(message, 'error', 'Starting position must be a number.');
        if (isNaN(end)) return this.client.ui.reply(message, 'error', 'Ending position must be a number.');

        /* Slice original array to get the length. */
        const n = parseInt(queue.songs.slice(start, end).length + 1);

        /* Modify queue to remove the entries. */
        queue.songs.splice(start, n);

        return this.client.ui.reply(message, 'ok', `Removed **${n}** entries from the queue.`);
      } else {
        /* Removing only one entry from the queue. */
        const song = queue.songs[args[1]];

        /* Checking if argument is a number. */
        const n = parseInt(args[1]);
        if (isNaN(n)) return this.client.ui.reply(message, 'error', 'Selection must be a number.');

        /* Modify queue to remove the specified entry. */
        queue.songs.splice(args[1], 1);

        return this.client.ui.reply(message, 'ok', `Removed **${song.name}** from the queue.`);
      }
    } else {
      return this.client.ui.reply(message, 'error', 'You must have the DJ role on this server, or the **Manage Channel** permission to use that command. Being alone with me works too!');
    }
  }
};
