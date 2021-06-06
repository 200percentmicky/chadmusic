const { Command } = require('discord-akairo')
const { MessageEmbed } = require('discord.js')
const { Paginator } = require('array-paginator')
// const { FieldsEmbed } = require('discord-paginationembed')

// TODO: Use Discord Embed Buttons to go to the next page.

module.exports = class CommandQueue extends Command {
  constructor () {
    super('queue', {
      aliases: ['queue', 'q'],
      category: '🎶 Music',
      description: {
        text: 'View the queue for this server.'
      },
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS']
    })
  }

  async exec (message) {
    const args = message.content.split(/ +/g)
    const djMode = this.client.settings.get(message.guild.id, 'djMode')
    const djRole = this.client.settings.get(message.guild.id, 'djRole')
    const dj = message.member.roles.cache.has(djRole) || message.channel.permissionsFor(message.member.user.id).has(['MANAGE_CHANNELS'])
    if (djMode) {
      if (!dj) return message.say('no', 'DJ Mode is currently active. You must have the DJ Role or the **Manage Channels** permission to use music commands at this time.', 'DJ Mode')
    }

    const queue = this.client.player.getQueue(message)
    const vc = message.member.voice.channel
    const currentVc = this.client.voice.connections.get(message.guild.id)

    if (!this.client.player.isPlaying(message) || !currentVc) return message.say('warn', 'Nothing is currently playing in this server.')
    else if (vc.id !== currentVc.channel.id) return message.say('error', 'You must be in the same voice channel that I\'m in to use that command.')

    /* Getting the entire queue. */
    const songs = queue.songs.slice(1)
    const song = queue.songs[0]

    /* Create a paginated array. */
    const queuePaginate = new Paginator(songs, 10)

    /* Get the page of the array. */
    let paginateArray = queuePaginate.page(args[1] || 1)

    /* If the paginator total is less than the parameter provided. */
    if (queuePaginate > args[1]) paginateArray = queuePaginate.last()

    /* Map the array. */
    const queueMap = songs.length > 0
      ? paginateArray.map(song => `**${songs.indexOf(song) + 1}:** ${song.user} \`${song.formattedDuration}\` [${song.name}](${song.url})`).join('\n')
      : `${process.env.EMOJI_WARN} The queue is empty. Start adding some songs! 😉`

    /* Making the embed. */
    const queueEmbed = new MessageEmbed()
      .setColor(this.client.utils.randColor())
      .setAuthor(`Queue for ${message.guild.name} - ${currentVc.channel.name}`, message.guild.iconURL({ dynamic: true }))
      .setDescription(`${process.env.EMOJI_OK} **Currently Playing:**\n${song.user} \`${song.formattedDuration}\`\n**[${song.name}](${song.url})**\n\n${queueMap}`)
      .setTimestamp()
      .setFooter(`${songs.length > 0 ? `Page ${queuePaginate.current} of ${queuePaginate.total}` : 'Queue is empty.'}`, message.author.avatarURL({ dynamic: true }))

    /* Finally send the embed of the queue. */
    return message.reply({ embed: queueEmbed, allowedMentions: { repliedUser: false } })

    /*
    try {
      const queueEmbed = new FieldsEmbed()
        .setArray(songs)
        .setAuthorizedUsers(message.author.id)
        .setChannel(message.channel)
        .setElementsPerPage(7)
        .setPageIndicator('footer')
        .formatField(`${songs.length} entr${songs.length === 1 ? 'y' : 'ies'} in the queue.`, song => `${song ? `\n**${songs.indexOf(song) + 1}:** ${song.user} \`${song.formattedDuration}\` [${song.name.length > 35 ? song.name.slice(0, 35) + '...' : song.name}](${song.url})` : `${process.env.EMOJI_WARN}Queue is empty.`}`)
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
        .setDescription(`${process.env.EMOJI_OK}**Currently Playing:**\n${song.user} \`${song.formattedDuration}\`\n**[${song.name}](${song.url})**`)
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
            .setDescription(`${process.env.EMOJI_OK} **Currently Playing:**\n${song.user} \`${song.formattedDuration}\`\n**[${song.name}](${song.url})**`)
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
    */
  }
}
