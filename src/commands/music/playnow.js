const { Command } = require('discord-akairo');
const { Permissions } = require('discord.js');

function pornPattern (url) {
  // ! TODO: Come up with a better regex lol
  // eslint-disable-next-line no-useless-escape
  const pornPattern = /https?:\/\/(www\.)?(pornhub|xhamster|xvideos|porntube|xtube|youporn|pornerbros|pornhd|pornotube|pornovoisines|pornoxo)\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/g;
  const pornRegex = new RegExp(pornPattern);
  return url.match(pornRegex);
}

module.exports = class CommandPlayNow extends Command {
  constructor () {
    super('playnow', {
      aliases: ['playnow', 'pn'],
      category: '🎶 Music',
      description: {
        text: 'Plays a song regardless if there is anything currently playing.',
        usage: 'playnow <URL/search>'
      },
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS']
    });
  }

  async exec (message) {
    const args = message.content.split(/ +/g);
    const text = args.slice(1).join(' ');
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
    
    if (!text && !message.attachments.first()) return this.client.ui.usage(message, 'playnow <url/search/attachment>');
    
    if (pornPattern(text)) return this.client.ui.reply(message, 'no', "The URL you're requesting to play is not allowed.");

    const queue = this.client.player.getQueue(message);
    if (!queue) return this.client.ui.reply(message, 'warn', 'Nothing is currently playing in this server. Use the `play` command instead.');

    const currentVc = this.client.vc.get(vc);
    if (!currentVc) {
      const permissions = vc.permissionsFor(this.client.user.id).has(['CONNECT']);
      if (!permissions) return this.client.ui.reply(message, 'no', `Missing **Connect** permission for <#${vc.id}>`);

      if (vc.type === 'stage') {
        await this.client.vc.join(vc); // Must be awaited only if the VC is a Stage Channel.
        const stageMod = vc.permissionsFor(this.client.user.id).has(Permissions.STAGE_MODERATOR);
        if (!stageMod) {
          const requestToSpeak = vc.permissionsFor(this.client.user.id).has(['REQUEST_TO_SPEAK']);
          if (!requestToSpeak) {
            vc.leave();
            return this.client.ui.reply(message, 'no', `Missing **Request to Speak** permission for <#${vc.id}>.`);
          } else if (message.guild.me.voice.suppress) {
            await message.guild.me.voice.setRequestToSpeak(true);
          }
        } else {
          await message.guild.me.voice.setSuppressed(false);
        }
      } else {
        this.client.vc.join(vc);
      }
    } else {
      if (vc.id !== currentVc.channel.id) return this.client.ui.reply(message, 'error', 'You must be in the same voice channel that I\'m in to use that command.');
    }

    if (vc.members.size <= 3 || dj) {
      if (vc.id !== currentVc.channel.id) return this.client.ui.reply(message, 'error', 'You must be in the same voice channel that I\'m in to use that command.');

      message.channel.sendTyping();
      // Adding song to position 1 of the queue. options.skip is shown to be unreliable.
      // This is probably due to the addition of metadata being passed into the player.
      // The bot does not use this for now, as its using events to parse info instead.
      // eslint-disable-next-line no-useless-escape
      await this.client.player.play(vc, text.replace(/(^\<+|\>+$)/g, '') || message.attachments.first().url, {
        member: message.member,
        textChannel: message.channel,
        message: message,
        position: 1
      });
      await this.client.player.skip(message)
      message.react(process.env.REACTION_OK);
    } else {
      return this.client.ui.reply(message, 'error', 'You must have the DJ role on this server, or the **Manage Channel** permission to use that command. Being alone with me works too!');
    }
  }
};
