const { SlashCommand } = require('slash-create');
const { Permissions } = require('discord.js');

class CommandStop extends SlashCommand {
  constructor (creator) {
    super(creator, {
      name: 'stop',
      description: 'Destroys the player.'
    });

    this.filePath = __filename;
  }

  async run (ctx) {
    const client = this.creator.client;
    const guild = client.guilds.cache.get(ctx.guildID);
    const channel = await guild.channels.fetch(ctx.channelID);
    const _member = await guild.members.fetch(ctx.member.id);

    const djMode = client.settings.get(ctx.guildID, 'djMode');
    const djRole = client.settings.get(ctx.guildID, 'djRole');
    const dj = _member.roles.cache.has(djRole) || channel.permissionsFor(_member.user.id).has(Permissions.FLAGS.MANAGE_CHANNELS);
    if (djMode) {
      if (!dj) return client.ui.ctx(ctx, client, 'no', true, 'DJ Mode is currently active. You must have the DJ Role or the **Manage Channels** permission to use music commands at this time.', 'DJ Mode');
    }

    const textChannel = client.settings.get(ctx.guildID, 'textChannel', null);
    if (textChannel) {
      if (textChannel !== channel.id) {
        return client.ui.ctx(ctx, client, 'no', true, `Music commands must be used in <#${textChannel}>.`);
      }
    }

    const vc = _member.voice.channel;
    if (!vc) return client.ui.ctx(ctx, client, 'error', true, 'You are not in a voice channel.');

    const currentVc = client.vc.get(vc);
    if (!client.player.getQueue(guild) || !currentVc) return client.ui.ctx(ctx, client, 'warn', true, 'Nothing is currently playing in this server.');
    else if (vc.id !== currentVc._channel.id) return client.ui.ctx(ctx, client, 'error', true, 'You must be in the same voice channel that I\'m in to use that command.');

    if (vc.members.size <= 2 || dj) {
      client.player.stop(guild);
      client.vc.leave(guild);
      return client.ui.ctxCustom(ctx, client, false, '⏹', process.env.COLOR_INFO, 'Stopped the player and cleared the queue.');
    } else {
      return client.ui.ctx(ctx, client, 'error', true, 'You must have the DJ role on this server, or the **Manage Channel** permission to use that command. Being alone with me works too!');
    }
  }
}

module.exports = CommandStop;
