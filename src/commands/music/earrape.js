const { Command } = require('discord-akairo');

module.exports = class CommandEarrape extends Command {
  constructor () {
    super('earrape', {
      aliases: ['earrape'],
      category: '🎶 Music',
      description: {
        text: 'Changes the volume of the player to 69420%.',
        details: 'The ratio that no man can withstand. Only works if Unlimited Volume is On.'
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
      if (!dj) {
        return this.client.ui.say(message, 'no', 'DJ Mode is currently active. You must have the DJ Role or the **Manage Channels** permission to use music commands at this time.');
      }
    }

    const textChannel = this.client.settings.get(message.guild.id, 'textChannel', null);
    if (textChannel) {
      if (textChannel !== message.channel.id) {
        return this.client.ui.say(message, 'no', `Music commands must be used in <#${textChannel}>.`);
      }
    }

    const allowFreeVolume = await this.client.settings.get(message.guild.id, 'allowFreeVolume', true);
    if (!allowFreeVolume) {
      return this.client.ui.say(message, 'no', 'This command cannot be used because **Unlimited Volume** is disabled.');
    }

    // This command should not be limited by the DJ Role. Must be a toggable setting.
    const vc = message.member.voice.channel;
    const currentVc = this.client.vc.get(vc);
    if (!vc) {
      return this.client.ui.reply(message, 'error', 'You are not in a voice channel.');
    } else if (vc.id !== currentVc._channel.id) {
      return this.client.ui.reply(message, 'error', 'You must be in the same voice channel that I\'m in to use that command.');
    }

    const queue = this.client.player.getQueue(message.guild.id);
    if (!queue) {
      return this.client.ui.say(message, 'warn', 'Nothing is currently playing on this server.');
    }

    const earrape = 69420; // 😂👌👌💯
    const volume = this.client.player.getQueue(message).volume;
    const defaultVolume = this.client.settings.get(message.guild.id, 'defaultVolume', 100);
    if (volume >= 5000) {
      this.client.player.setVolume(message, defaultVolume);
      return this.client.ui.say(message, 'ok', `Volume has been set to **${defaultVolume}%**. 😌😏`);
    } else {
      this.client.player.setVolume(message, earrape);
      return this.client.ui.say(
        message,
        'ok',
        `🔊💢💀 Volume has been set to **${earrape}%**. 😂👌👌`,
        null,
        'Volumes exceeding 200% may cause damage to self and equipment.'
      );
    }
  }
};
