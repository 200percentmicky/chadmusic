const { Command } = require('discord-akairo');
const { Permissions } = require('discord.js');

module.exports = class CommandDisconnect extends Command {
  constructor () {
    super('disconnect', {
      aliases: ['disconnect', 'leave', 'pissoff', 'fuckoff'],
      category: '🎶 Music',
      description: {
        text: 'Disconnects from the current voice channel.'
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
      if (!dj) {
        return this.client.ui.reply(message, 'no', 'DJ Mode is currently active. You must have the DJ Role or the **Manage Channels** permission to use music commands at this time.', 'DJ Mode');
      }
    }

    const textChannel = this.client.settings.get(message.guild.id, 'textChannel', null);
    if (textChannel) {
      if (textChannel !== message.channel.id) {
        return this.client.ui.reply(message, 'no', `Music commands must be used in <#${textChannel}>.`);
      }
    }

    const vc = message.member.voice.channel;
    const currentVc = this.client.vc.get(message.member.voice.channel);
    if (!currentVc) {
      return this.client.ui.reply(message, 'error', 'I\'m not in any voice channel.');
    }

    if (!vc) {
      return this.client.ui.reply(message, 'error', 'You are not in a voice channel.');
    } else if (vc.id !== currentVc.channel.id) {
      return this.client.ui.reply(message, 'error', 'You must be in the same voice channel that I\'m in to use that command.');
    }

    if (vc.members.size <= 2 || dj) {
      if (this.client.player.getQueue(message)) {
        this.client.player.stop(message);
      }
      this.client.vc.leave(message);
      return this.client.ui.custom(message, '📤', 0xDD2E44, `Left <#${vc.id}>`);
    } else {
      return this.client.ui.reply(message, 'error', 'You must have the DJ role on this server, or the **Manage Channel** permission to use that command. Being alone with me works too!');
    }
  }
};
