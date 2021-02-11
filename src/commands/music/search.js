const { Command } = require('discord-akairo')
const { MessageEmbed } = require('discord.js')
const { search } = require('../../aliases.json')

module.exports = class CommandSearch extends Command {
  constructor () {
    super(search !== undefined ? search[0] : 'search', {
      aliases: search || ['search'],
      category: '🎶 Player',
      description: {
        text: 'Searches for a song on YouTube.',
        usage: '<query>'
      },
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS']
    })
  }

  async exec (message) {
    const args = message.content.split(/ +/g)
    const search = args.slice(1).join(' ')
    const settings = this.client.settings.get(message.guild.id)
    const dj = message.member.roles.cache.has(settings.djRole) || message.member.hasPermission(['MANAGE_CHANNELS'])
    if (settings.djMode) {
      if (!dj) return message.say('no', 'DJ Mode is currently active. You must have the DJ Role or the **Manage Channels** permission to use music commands at this time.', 'DJ Mode')
    }

    const vc = message.member.voice.channel
    if (!vc) return message.say('error', 'You are not in a voice channel.')

    const prefix = this.client.prefix.getPrefix(message.guild.id)
      ? this.client.prefix.getPrefix(message.guild.id)
      : this.client.config.prefix
    if (!search) return message.say('info', `\`${prefix}search <query>\``, 'Usage')

    message.channel.startTyping()
    const currentVc = this.client.voice.connections.get(message.guild.id)
    if (!currentVc) {
      const permissions = vc.permissionsFor(this.client.user.id).has(['CONNECT', 'SPEAK'])
      if (!permissions) return message.say('error', `Missing **Connect** or **Speak** permissions for **${vc.name}**`)
      vc.join()
    } else {
      if (vc.id !== currentVc.channel.id) return message.say('error', 'You must be in the same voice channel that I\'m in to use that command.')
    }

    message.channel.startTyping()
    const queue = this.client.player.getQueue(message.guild.id)

    // These limitations should not affect a member with DJ permissions.
    if (!dj) {
      if (queue) {
        if (settings.maxQueueLimit) {
          const queueMemberSize = queue.songs.filter(entries => entries.user.id === message.member.user.id).length
          if (queueMemberSize >= settings.maxQueueLimit) {
            message.say('no', `You are only allowed to add a max of ${settings.maxQueueLimit} entr${settings.maxQueueLimit === 1 ? 'y' : 'ies'} to the queue.`)
            return message.channel.stopTyping(true)
          }
        }
      }
    }

    message.channel.startTyping()
    this.client.player.search(search).then(results => {
      const resultMap = results.slice(0, 10).map(result => `${results.indexOf(result) + 1}: \`${result.formattedDuration}\` [${result.name}](${result.url})\n`)
      const embed = new MessageEmbed()
        .setColor(this.client.utils.randColor())
        .setAuthor('Search Results', message.author.avatarURL({ dynamic: true }))
        .setDescription(resultMap)
        .setFooter('Type the number of your selection. Type "cancel" if you changed your mind.')

      message.channel.send(embed).then(msg => {
        message.channel.awaitMessages(m => m.author.id === message.author.id, {
          max: 1,
          time: 30000,
          errors: ['time']
        }).then(async collected => {
          msg.delete()
          collected.first().delete()
          if (collected.first().content === 'CANCEL'.toLowerCase()) return
          if (isNaN(collected.first().content)) return message.say('error', 'You must provide a number when selecting a song. Please retry your search.')
          message.channel.startTyping(5)
          const selected = results[parseInt(collected.first().content - 1)].url
          await this.client.player.play(message, selected)
          message.react(this.client.emoji.okReact)
          return message.channel.stopTyping(true)
        }).catch(() => {
          return msg.delete()
        })
      })
    })

    return message.channel.stopTyping(true)
  }
}
