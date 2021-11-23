const { SlashCommand, CommandOptionType } = require('slash-create');
const { Permissions } = require('discord.js');

const pornPattern = (url) => {
  // ! TODO: Come up with a better regex lol
  // eslint-disable-next-line no-useless-escape
  const pornPattern = /https?:\/\/(www\.)?(pornhub|xhamster|xvideos|porntube|xtube|youporn|pornerbros|pornhd|pornotube|pornovoisines|pornoxo)\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/g;
  const pornRegex = new RegExp(pornPattern);
  return url.match(pornRegex);
};

class CommandPlay extends SlashCommand {
  constructor (creator) {
    super(creator, {
      name: 'play',
      description: 'Plays a song by URL, an attachment, or from a search result.',
      options: [
        {
          type: CommandOptionType.STRING,
          name: 'track',
          required: true,
          description: 'The track to play. You can use a URL of the track, or you can search or it.'
        }
      ]
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
    const dj = _member.roles.cache.has(djRole) || channel.permissionsFor(_member.user.id).has(['MANAGE_CHANNELS']);
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

    // if (!text && !message.attachments.first()) return client.ui.usage(message, 'play <url/search/attachment>');

    if (pornPattern(ctx.options.track)) return client.ui.ctx(ctx, client, 'no', true, "The URL you're requesting to play is not allowed.");

    const currentVc = client.vc.get(vc);
    if (!currentVc) {
      const permissions = vc.permissionsFor(client.user.id).has(Permissions.FLAGS.CONNECT);
      if (!permissions) return client.ui.ctx(ctx, client, 'no', true, `Missing **Connect** permission for <#${vc.id}>`);

      if (vc.type === 'stage') {
        await client.vc.join(vc); // Must be awaited only if the VC is a Stage Channel.
        const stageMod = vc.permissionsFor(client.user.id).has(Permissions.STAGE_MODERATOR);
        if (!stageMod) {
          const requestToSpeak = vc.permissionsFor(client.user.id).has(Permissions.FLAGS.REQUEST_TO_SPEAK);
          if (!requestToSpeak) {
            client.vc.leave(guild);
            return client.ui.ctx(ctx, client, 'no', true, `Missing **Request to Speak** permission for <#${vc.id}>.`);
          } else if (guild.me.voice.suppress) {
            await guild.me.voice.setRequestToSpeak(true);
          }
        } else {
          await guild.me.voice.setSuppressed(false);
        }
      } else {
        client.vc.join(vc);
      }
    } else {
      if (vc.id !== currentVc._channel.id) return client.ui.ctx(ctx, client, 'error', true, 'You must be in the same voice channel that I\'m in to use that command.');
    }

    const queue = client.player.getQueue(guild.id);

    // These limitations should not affect a member with DJ permissions.
    if (!dj) {
      if (queue) {
        const maxQueueLimit = await client.settings.get(guild.id, 'maxQueueLimit');
        if (maxQueueLimit) {
          const queueMemberSize = queue.songs.filter(entries => entries.user.id === _member.user.id).length;
          if (queueMemberSize >= maxQueueLimit) {
            return client.ui.ctx(ctx, client, 'no', true, `You are only allowed to add a max of ${maxQueueLimit} entr${maxQueueLimit === 1 ? 'y' : 'ies'} to the queue.`);
          }
        }
      }
    }

    try {
      /* eslint-disable-next-line no-useless-escape */
      await client.player.playVoiceChannel(vc, ctx.options.track.replace(/(^\<+|\>+$)/g, ''), {
        textChannel: channel,
        member: _member
      });
      return ctx.send(`${process.env.EMOJI_MUSIC}`);
    } catch (err) {
      client.logger.error(err.stack); // Just in case.
      return client.ui.ctx(ctx, client, 'error', true, `An unknown error occured:\n\`\`\`js\n${err.name}: ${err.message}\`\`\``, 'Player Error');
    }
  }
}

module.exports = CommandPlay;
