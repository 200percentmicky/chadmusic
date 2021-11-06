const { Command } = require('discord-akairo');
const { shuffle } = require('../../aliases.json');

module.exports = class CommandShuffle extends Command {
  constructor () {
    super(shuffle !== undefined ? shuffle[0] : 'shuffle', {
      aliases: shuffle || ['shuffle'],
      category: '🎶 Music',
      description: {
        text: 'Randomizes the entries in the queue.'
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
    if (vc.members.size <= 2 || dj) {
      if (vc.id !== currentVc.channel.id) return this.client.ui.reply(message, 'error', 'You must be in the same voice channel that I\'m in to use that command.');

      const queue = this.client.player.getQueue(message);
      if (!queue) return this.client.ui.reply(message, 'warn', 'Nothing is currently playing in this server.');
      this.client.player.shuffle(message);
      return this.client.ui.reply(message, 'ok', `**${queue.songs.length - 1}** entries have been shuffled.`);
    } else {
      return this.client.ui.reply(message, 'error', 'You must have the DJ role on this server, or the **Manage Channel** permission to use that command. Being alone with me works too!');
    }
  }
};
