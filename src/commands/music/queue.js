const { Command } = require('discord-akairo')
const { MessageEmbed } = require('discord.js')
const { FieldsEmbed } = require('discord-paginationembed')
const { queue } = require('../../aliases.json')

module.exports = class CommandQueue extends Command {
  constructor () {
    super(queue !== undefined ? queue[0] : 'queue', {
      aliases: queue || ['queue'],
      category: '🎶 Player',
      description: {
        text: 'View the queue for this server.'
      },
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS']
    })
  }

  async exec (message) {
    const settings = this.client.settings.get(message.guild.id)
    const dj = message.member.roles.cache.has(settings.djRole) || message.member.hasPermission(['MANAGE_CHANNELS'])
    if (settings.djMode) {
      if (!dj) return message.say('no', 'DJ Mode is currently active. You must have the DJ Role or the **Manage Channels** permission to use music commands at this time.', 'DJ Mode')
    }

    const queue = this.client.player.getQueue(message)
    const vc = message.member.voice.channel
    const currentVc = this.client.voice.connections.get(message.guild.id)

    if (!this.client.player.isPlaying(message) || !currentVc) return message.say('warn', 'Nothing is currently playing in this server.')
    else if (vc.id !== currentVc.channel.id) return message.say('error', 'You must be in the same voice channel that I\'m in to use that command.')

    const songs = queue.songs.slice(1)
    const song = queue.songs[0]

    try {
      const queueEmbed = new FieldsEmbed()
        .setArray(songs)
        .setAuthorizedUsers(message.author.id)
        .setChannel(message.channel)
        .setElementsPerPage(5)
        .setPageIndicator('footer')
        .formatField(`${songs.length} entr${songs.length === 1 ? 'y' : 'ies'} in the queue.`, song => song ? `\n**${songs.indexOf(song) + 1}:** ${song.user} \`${song.formattedDuration}\` [${song.name}](${song.url})` : `${this.client.emoji.warn}Queue is empty.`)
        .setPage(1)
        .setNavigationEmojis({
          back: '◀',
          jump: '↗',
          forward: '▶',
          delete: '❌'
        })

      queueEmbed.embed
        .setColor(this.client.utils.randColor())
        .setAuthor(`Queue for ${message.guild.name} - ${currentVc.channel.name}`, message.guild.iconURL({ dynamic: true }))
        .setDescription(`${this.client.emoji.music}**Currently Playing:**\n${song.user} \`${song.formattedDuration}\`\n**[${song.name}](${song.url})**`)
        .setTimestamp()
        .setFooter('\u200b') // Ironically required if .setPageIndicator() is using 'footer'.

      queueEmbed.build()
    } catch (err) {
      // If no array exists to build the embed.
      if (err.name.includes('TypeError')) {
        if (err.message.includes('Cannot invoke PaginationEmbed class')) {
          message.channel.send(new MessageEmbed()
            .setColor(this.client.utils.randColor())
            .setAuthor(`Queue for ${message.guild.name} - ${currentVc.channel.name}`, message.guild.iconURL({ dynamic: true }))
            .setDescription(`${this.client.emoji.music}**Currently Playing:**\n${song.user} \`${song.formattedDuration}\`\n**[${song.name}](${song.url})**`)
            .addField('The queue is empty.', 'Start adding some songs! 😉')
            .setTimestamp()
          )
        } else {
          // Different error?
          message.say('error', err.message, err.name)
        }
      } else {
        // Different error?
        message.say('error', err.message, err.name)
      }
    }
  }
}
