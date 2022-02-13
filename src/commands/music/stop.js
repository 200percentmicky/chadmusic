const { Command } = require('discord-akairo');
const { Permissions } = require('discord.js');
const { stop } = require('../../aliases.json');

module.exports = class CommandStop extends Command {
  constructor () {
    super(stop !== undefined ? stop[0] : 'stop', {
      aliases: stop || ['stop'],
      category: '🎶 Music',
      description: {
        text: 'Stops the player, and clears the queue.'
      },
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS']
    });
  }

  async exec (message) {
    const djMode = this.client.settings.get(message.guild.id, 'djMode');
    const djRole = this.client.settings.get(message.guild.id, 'djRole');
    const dj = message.member.roles.cache.has(djRole) || message.channel.permissionsFor(message.member.user.id).has(Permissions.FLAGS.MANAGE_CHANNELS);
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
      this.client.player.stop(message);
      this.client.vc.leave(message);
      return this.client.ui.custom(message, '⏹', process.env.COLOR_INFO, 'Stopped the player and cleared the queue.');
    } else {
      return this.client.ui.send(message, 'NOT_ALONE');
    }
  }
};
