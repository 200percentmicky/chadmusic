const { Command } = require('discord-akairo')
// const { MessageEmbed } = require('discord.js');
// const YouTube = require('youtube-sr');

function pornPattern (url) {
  // ! TODO: Come up with a better regex lol
  // eslint-disable-next-line no-useless-escape
  const pornPattern = /https?:\/\/(www\.)?(pornhub|xhamster|xvideos|porntube|xtube|youporn|pornerbros|pornhd|pornotube|pornovoisines|pornoxo)\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/g
  const pornRegex = new RegExp(pornPattern)
  return url.match(pornRegex)
}

module.exports = class CommandPlay extends Command {
  constructor () {
    super('play', {
      aliases: ['play', 'p'],
      category: '🎶 Player',
      description: {
        text: 'Play\'s a song from a URL or search term.',
        usage: '<url/search>',
        details: '`<url/search>` The URL or search term to load.'
      },
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS']
    })
  }

  async exec (message) {
    const args = message.content.split(/ +/g)
    const text = args.slice(1).join(' ')

    const djMode = this.client.djMode.get(message.guild.id)
    const djRole = this.client.djRole.get(message.guild.id)
    const dj = message.member.roles.cache.has(djRole) || message.channel.permissionsFor(message.member.user.id).has(['MANAGE_CHANNELS'])
    if (djMode) {
      if (!dj) return message.say('no', 'DJ Mode is currently active. You must have the DJ Role or the **Manage Channels** permission to use music commands at this time.', 'DJ Mode')
    }

    const vc = message.member.voice.channel
    if (!vc) return message.say('error', 'You are not in a voice channel.')

    if (!text) return message.usage('play <URL|search>')

    // eslint-disable-next-line no-useless-escape
    if (pornPattern(text)) return message.say('no', 'The URL you\'re requesting to play is not allowed.')

    const currentVc = this.client.voice.connections.get(message.guild.id)
    if (!currentVc) {
      const permissions = vc.permissionsFor(this.client.user.id).has(['CONNECT'])
      if (!permissions) return message.say('no', `Missing **Connect** permission for \`${vc.name}\``)
      vc.join()
    } else {
      if (vc.id !== currentVc.channel.id) return message.say('error', 'You must be in the same voice channel that I\'m in to use that command.')
    }

    message.channel.startTyping(5)
    const queue = this.client.player.getQueue(message.guild.id)

    // These limitations should not affect a member with DJ permissions.
    if (!dj) {
      if (queue) {
        const maxQueueLimit = this.client.maxQueueLimit.get(message.guild.id)
        if (maxQueueLimit) {
          const queueMemberSize = queue.songs.filter(entries => entries.user.id === message.member.user.id).length
          if (queueMemberSize >= maxQueueLimit) {
            message.say('no', `You are only allowed to add a max of ${maxQueueLimit} entr${maxQueueLimit === 1 ? 'y' : 'ies'} to the queue.`)
            return message.channel.stopTyping(true)
          }
        }
      }
    }

    try {
      /* Keeping this around just in case.
      const urlPattern = /https?:\/\/(www\.)?(youtu(be)?)\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/g;
      const urlRegex = new RegExp(urlPattern);
      if (text.match(urlRegex))
      {
        try {
          const playlistPattern = /https?:\/\/(www\.)?(youtu(be)?)\.[a-zA-Z0-9()]{1,6}\b\/(playlist)([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/g;
          const playlistRegex = new RegExp(playlistPattern);
          if (text.match(playlistRegex))
          {
            await this.client.player.play(message, text);
            message.react(this.client.emoji.okReact);
          } else {
            const result = await YouTube.search(text, { limit: 1 });
            await this.client.player.play(message, `https://youtu.be/${result[0].id}`);
            message.react(this.client.emoji.okReact);
          }
        } catch(err) {
          return message.say('error', `No results found for \`${text}\``, 'Track Error');
        }
      } else {
        await this.client.player.play(message, text);
        message.react(this.client.emoji.okReact);
      }
      */

      // eslint-disable-next-line no-useless-escape
      await this.client.player.play(message, text.replace(/(^\<+|\>+$)/g, ''))
      const emojiPerms = message.channel.permissionsFor(this.client.user.id).has(['USE_EXTERNAL_EMOJIS'])
      message.react(emojiPerms ? this.client.emoji.musicReact : '🎵')
    } catch (err) {
      this.client.logger.error(err.stack) // Just in case.
      return message.say('error', `An unknown error occured:\n\`\`\`js\n${err.name}: ${err.message}\`\`\``, 'Player Error')
    } finally {
      message.channel.stopTyping(true)
    }
  }
}
