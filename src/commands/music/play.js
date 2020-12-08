const { Command } = require('discord-akairo')
// const { MessageEmbed } = require('discord.js');
// const YouTube = require('youtube-sr');

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

    const settings = this.client.settings.get(message.guild.id)
    const dj = message.member.roles.cache.has(settings.djRole) || message.member.hasPermission(['MANAGE_CHANNELS'])
    if (settings.djMode) {
      if (!dj) return message.forbidden('DJ Mode is currently active. You must have the DJ Role or the **Manage Channels** permission to use music commands at this time.', 'DJ Mode')
    }

    if (!text) return message.warn('C\'mon, I can\'t really play literally nothing. Provide me a song to search or a valid URL to play, and lets get this party started!')

    const vc = message.member.voice.channel
    if (!vc) return message.error('You are not in a voice channel.')

    // eslint-disable-next-line no-useless-escape
    const pornPattern = /https?:\/\/(www\.)?(pornhub|xhamster|xvideos|porntube|xtube|youporn|pornerbros|pornhd|pornotube|pornovoisines|pornoxo)\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/g
    const pornRegex = new RegExp(pornPattern)
    if (text.match(pornRegex)) return message.forbidden('The URL you\'re requesting to play is not allowed.')

    const currentVc = this.client.voice.connections.get(message.guild.id)
    if (!currentVc) {
      const permissions = vc.permissionsFor(this.client.user.id).has(['CONNECT', 'SPEAK'])
      if (!permissions) return message.error(`Missing **Connect** or **Speak** permissions for **${vc.name}**`)
      vc.join()
    } else {
      if (vc.id !== currentVc.channel.id) return message.error('You must be in the same voice channel that I\'m in to use that command.')
    }

    message.channel.startTyping(5)
    const queue = this.client.player.getQueue(message.guild.id)

    // These limitations should not affect a member with DJ permissions.
    if (!dj) {
      if (queue) {
        if (settings.maxQueueLimit) {
          const queueMemberSize = queue.songs.filter(entries => entries.user.id === message.member.user.id).length
          if (queueMemberSize >= settings.maxQueueLimit) {
            message.forbidden(`You are only allowed to add a max of ${settings.maxQueueLimit} entr${settings.maxQueueLimit === 1 ? 'y' : 'ies'} to the queue.`)
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
          return message.error(`No results found for \`${text}\``, 'Track Error');
        }
      } else {
        await this.client.player.play(message, text);
        message.react(this.client.emoji.okReact);
      }
      */

      await this.client.player.play(message, text)
      message.react(this.client.emoji.okReact)
    } catch (err) {
      message.error(err.message, 'Track Error')
    } finally {
      message.channel.stopTyping(true)
    }
  }
}
