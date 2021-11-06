const { oneLine, stripIndents } = require('common-tags');
const { Command } = require('discord-akairo');

module.exports = class CommandReverse extends Command {
  constructor () {
    super('reverse', {
      aliases: ['reverse'],
      category: '📢 Filter',
      description: {
        text: 'Plays the music in reverse.',
        usage: '[off]',
        details: stripIndents`
        \`[off]\` Turns off reverse if its active.
        `
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
    const dj = message.member.roles.cache.has(djRole) ||
      message.channel.permissionsFor(message.member.user.id).has(['MANAGE_CHANNELS']);

    if (djMode) {
      if (!dj) {
        return this.client.ui.reply(message, 'no', oneLine`
          DJ Mode is currently active. You must have the DJ Role or the **Manage Channels** 
          permission to use music commands at this time.
        `);
      }
    }

    if (allowFilters === 'dj') {
      if (!dj) {
        return this.client.ui.reply(message, 'no', 'You must have the DJ Role or the **Manage Channels** permission to use filters.');
      }
    }

    const vc = message.member.voice.channel;
    if (!vc) return this.client.ui.reply(message, 'error', 'You are not in a voice channel.');

    const queue = this.client.player.getQueue(message.guild.id);
    if (!queue) return this.client.ui.reply(message, 'warn', 'Nothing is currently playing on this server.');

    const currentVc = this.client.vc.get(vc);
    if (currentVc) {
      if (args[1] === 'OFF'.toLowerCase()) {
        try {
          await this.client.player.setFilter(message.guild.id, 'reverse', false);
          return this.client.ui.custom(message, '📢', process.env.COLOR_INFO, '**Reverse** Off');
        } catch (err) {
          return this.client.ui.reply(message, 'error', '**Reverse** is not applied to the player.');
        }
      } else {
        await this.client.player.setFilter(message.guild.id, 'reverse', 'areverse');
        return this.client.ui.custom(message, '📢', process.env.COLOR_INFO, '**Reverse** On');
      }
    } else {
      if (vc.id !== currentVc.channel.id) {
        return this.client.ui.reply(message, 'error', oneLine`
          You must be in the same voice channel that I\'m in to use that command.
        `);
      }
    }
  }
};
