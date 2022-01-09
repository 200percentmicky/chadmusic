const { Command } = require('discord-akairo');

module.exports = class CommandForceSkip extends Command {
  constructor () {
    super('forceskip', {
      aliases: ['forceskip', 'fs'],
      category: '🎶 Music',
      description: {
        text: 'Force skips the currently playing song, bypassing votes.'
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
      if (!dj) return this.client.ui.reply(message, 'no', 'DJ Mode is currently active. You must have the DJ Role or the **Manage Channels** permission to use music commands at this time.');
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
    if (!this.client.player.getQueue(message) || !currentVc) return this.client.ui.reply(message, 'warn', 'Nothing is currently playing in this server.');
    else if (vc.id !== currentVc.channel.id) return this.client.ui.reply(message, 'error', 'You must be in the same voice channel that I\'m in to use that command.');

    // For breaking use only.
    // this.client.player.skip(message)
    // return this.client.ui.reply(message, '⏭', process.env.COLOR_INFO, 'Skipped!')

    /*
    if (args[1] === ('--force' || '-f')) {
      if (!dj) return this.client.ui.reply(message, 'error', 'You must have the DJ role or the **Manage Channel** permission to use the `--force` flag.')
      this.client.player.skip(message)
      return this.client.ui.custom(message, '⏭', process.env.COLOR_INFO, 'Skipped!')
    }
    */

    const queue = this.client.player.getQueue(message);
    if (queue.votes.length > 0) queue.votes = [];

    if (vc.members.size <= 2) {
      if (!this.client.player.getQueue(message).songs[1]) {
        this.client.player.stop(message);
        return this.client.ui.custom(message, '🏁', process.env.COLOR_INFO, "Reached the end of the queue. I'm outta here!");
      }
      this.client.player.skip(message);
      return this.client.ui.custom(message, '⏭', process.env.COLOR_INFO, 'Skipped!');
    } else {
      if (dj) {
        this.client.player.skip(message);
        return this.client.ui.custom(message, '⏭', process.env.COLOR_INFO, 'Skipped!');
      } else {
        return this.client.ui.reply(message, 'error', 'You must have the DJ role on this server, or the **Manage Channel** permission to use that command. Being alone with me works too!');
      }
    }
  }
};
