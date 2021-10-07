const { Command } = require('discord-akairo');

module.exports = class CommandTempo extends Command {
  constructor () {
    super('tempo', {
      aliases: ['tempo'],
      category: '📢 Filter',
      description: {
        text: 'Changes the tempo of the player.',
        usage: '<rate:int[1-20]>',
        details: '`<rate:int[1-20]>` The rate to change. Anything lower than 5 will slow down playback.'
      },
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS']
    });
  }

  async exec (message) {
    const args = message.content.split(/ +/g);
    const djMode = this.client.settings.get(message.guild.id, 'djMode');
    const djRole = this.client.settings.get(message.guild.id, 'djRole');
    const allowFilters = this.client.settings.get(message.guild.id, 'allowFilters');
    const dj = message.member.roles.cache.has(djRole) || message.channel.permissionsFor(message.member.user.id).has(['MANAGE_CHANNELS']);

    if (djMode) {
      if (!dj) return this.client.ui.say(message, 'no', 'DJ Mode is currently active. You must have the DJ Role or the **Manage Channels** permission to use music commands at this time.');
    }

    if (allowFilters === 'dj') {
      if (!dj) {
        return this.client.ui.say(message, 'no', 'You must have the DJ Role or the **Manage Channels** permission to use filters.');
      }
    }

    const vc = message.member.voice.channel;
    if (!vc) return this.client.ui.reply(message, 'error', 'You are not in a voice channel.');

    const queue = this.client.player.getQueue(message.guild.id);
    if (!queue) return this.client.ui.say(message, 'warn', 'Nothing is currently playing on this server.');

    const currentVc = this.client.vc.get(vc);
    if (currentVc) {
      if (!args[1]) {
        return this.client.ui.usage(message, 'tempo <rate:int[1-20]/off>');
      }

      if (args[1] === 'OFF'.toLowerCase()) {
        try {
          await this.client.player.setFilter(message.guild.id, 'asetrate', false);
          return this.client.ui.custom(message, '📢', process.env.COLOR_INFO, '**Tempo** Reverted');
        } catch (err) {
          return this.client.ui.reply(message, 'error', '**Tempo** is not applied to the player.');
        }
      }

      const rate = parseInt(args[1]);
      if (isNaN(rate)) {
        return this.client.ui.reply(message, 'error', 'Tempo requires a number or **off**.');
      }
      if (rate <= 0 || rate >= 21) {
        return this.client.ui.reply(message, 'error', 'Tempo must be between **1-20** or **off**.');
      }
      await this.client.player.setFilter(message, 'asetrate', `asetrate=${rate}*10000`);
      return this.client.ui.custom(message, '📢', process.env.COLOR_INFO, `**Tempo** Rate: \`${rate}\``);
    } else {
      if (vc.id !== currentVc.channel.id) return this.client.ui.reply(message, 'error', 'You must be in the same voice channel that I\'m in to use that command.');
    }
  }
};
