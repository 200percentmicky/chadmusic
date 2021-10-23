const { Command } = require('discord-akairo');

module.exports = class CommandVolume extends Command {
  constructor () {
    super('volume', {
      aliases: ['volume', 'vol'],
      category: '🎶 Music',
      description: {
        text: 'Changes the volume of the player.',
        usage: '<number>',
        details: '`<number>` The percentage of the new volume to set.'
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
      if (!dj) return this.client.ui.say(message, 'no', 'DJ Mode is currently active. You must have the DJ Role or the **Manage Channels** permission to use music commands at this time.', 'DJ Mode');
    }

    const textChannel = this.client.settings.get(message.guild.id, 'textChannel', null);
    if (textChannel) {
      if (textChannel !== message.channel.id) {
        return this.client.ui.say(message, 'no', `Music commands must be used in <#${textChannel}>.`);
      }
    }

    const args = message.content.split(/ +/g);

    const vc = message.member.voice.channel;
    if (!vc) return this.client.ui.reply(message, 'error', 'You are not in a voice channel.');

    const queue = this.client.player.getQueue(message.guild.id);
    if (!queue) return this.client.ui.say(message, 'warn', 'Nothing is currently playing on this server.');

    const volume = queue.volume;
    if (!args[1]) {
      const volumeEmoji = () => {
        const volumeIcon = {
          50: '🔈',
          100: '🔉',
          150: '🔊'
        };
        if (volume >= 175) return '🔊😭👌';
        return volumeIcon[Math.round(volume / 50) * 50];
      };
      return this.client.ui.custom(message, volumeEmoji(), process.env.COLOR_INFO, `Current Volume: **${volume}%**`);
    }

    let newVolume = parseInt(args[1]);
    const allowFreeVolume = await this.client.settings.get(message.guild.id, 'allowFreeVolume');
    if (allowFreeVolume === (false || undefined) && newVolume > 200) newVolume = 200;
    this.client.player.setVolume(message.guild.id, newVolume);

    if (newVolume >= 201) {
      return this.client.ui.say(
        message,
        'warn',
        `Volume has been set to **${newVolume}%**.`,
        null,
        'Volumes exceeding 200% may cause damage to self and equipment.'
      );
    } else {
      return this.client.ui.reply(message, 'ok', `Volume has been set to **${newVolume}%**.`);
    }
  }
};
