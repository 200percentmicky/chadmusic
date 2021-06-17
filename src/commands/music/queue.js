const { Command } = require('discord-akairo')
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js')
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
    const djMode = this.client.settings.get(message.guild.id, 'djMode')
    const djRole = this.client.settings.get(message.guild.id, 'djRole')
    const dj = message.member.roles.cache.has(djRole) || message.channel.permissionsFor(message.member.user.id).has(['MANAGE_CHANNELS'])
    if (djMode) {
      if (!dj) return message.say('no', 'DJ Mode is currently active. You must have the DJ Role or the **Manage Channels** permission to use music commands at this time.', 'DJ Mode')
    }

    const queue = this.client.player.getQueue(message)
    const vc = message.member.voice.channel

    if (!vc) return message.say('error', 'You are not in a voice channel.')

    const currentVc = this.client.voice.connections.get(message.guild.id)

    if (!this.client.player.isPlaying(message) || !currentVc) return message.say('warn', 'Nothing is currently playing in this server.')
    else if (vc.id !== currentVc.channel.id) return message.say('error', 'You must be in the same voice channel that I\'m in to use that command.')

    /* Getting the entire queue. */
    const songs = queue.songs.slice(1)
    const song = queue.songs[0]

    /* Create a paginated array. */
    const queuePaginate = new Paginator(songs, 10)

    /* Get the page of the array. */
    const paginateArray = queuePaginate.page(1)

    /* Map the array. */
    const queueMap = songs.length > 0
      ? paginateArray.map(song => `**${songs.indexOf(song) + 1}:**  [${song.name}](${song.url})\n${song.user} \`${song.formattedDuration}\``).join('\n\n')
      : `${process.env.EMOJI_WARN} The queue is empty. Start adding some songs!`

    /* Making the embed. */
    const queueEmbed = new MessageEmbed()
      .setColor(this.client.utils.randColor())
      .setAuthor(`Queue for ${message.guild.name} - ${currentVc.channel.name}`, message.guild.iconURL({ dynamic: true }))
      .setDescription(`<:pMusic:815331262255595610> **Currently Playing:**\n${song.user} \`${song.formattedDuration}\`\n**[${song.name}](${song.url})**\n\n${queueMap}`)
      .setTimestamp()
      .setFooter(`${songs.length > 0 ? `Page ${queuePaginate.current} of ${queuePaginate.total}` : 'Queue is empty.'}`, message.author.avatarURL({ dynamic: true }))

    /* Creating the buttons to interact with the queue. */

    // First Page
    const firstPage = new MessageButton()
      .setStyle('PRIMARY')
      .setLabel('First Page')
      .setEmoji('⏮')
      .setCustomID('first_page')
      .setDisabled(true) // Since the embed opens on the first page.

    // Previous Page
    const previousPage = new MessageButton()
      .setStyle('PRIMARY')
      .setLabel('Previous')
      .setEmoji('⏪')
      .setCustomID('previous_page')
      .setDisabled(true) // Since the embed opens on the first page.

    // Next Page
    const nextPage = new MessageButton()
      .setStyle('PRIMARY')
      .setLabel('Next')
      .setEmoji('⏩')
      .setCustomID('next_page')

    // Last Page
    const lastPage = new MessageButton()
      .setStyle('PRIMARY')
      .setLabel('Last Page')
      .setEmoji('⏭')
      .setCustomID('last_page')

    // Jump to Page
    const pageJump = new MessageButton()
      .setStyle('PRIMARY')
      .setLabel('Jump to Page')
      .setEmoji('↗')
      .setCustomID('page_jump')

    // Cancel
    const cancelButton = new MessageButton()
      .setStyle('DANGER')
      .setLabel('Close')
      .setEmoji(process.env.EMOJI_ERROR)
      .setCustomID('cancel_button')

    /* Row of buttons! */
    const buttonRow = new MessageActionRow()
      .addComponents(firstPage, previousPage, nextPage, lastPage, pageJump)

    /* Rand out of room for the cancel button, so... */
    const cancelRow = new MessageActionRow()
      .addComponents(cancelButton)

    const components = songs.length === 0 || songs.length <= 10 ? [cancelRow] : [buttonRow, cancelRow]

    /* Finally send the embed of the queue. */
    const msg = await message.reply({ embed: queueEmbed, components: components, allowedMentions: { repliedUser: false } })

    /* Button Collector */
    const filter = interaction => interaction.user.id === message.author.id
    const collector = await msg.createMessageComponentInteractionCollector(filter, {
      time: 30000
    })

    collector.on('collect', async interaction => {
      // First Page Button
      if (interaction.customID === 'first_page') {
        const paginateArray = queuePaginate.first()

        /* Map the array. */
        const queueMap = paginateArray.map(song => `**${songs.indexOf(song) + 1}:**  [${song.name}](${song.url})\n${song.user} \`${song.formattedDuration}\``).join('\n\n')

        /* Enable and disable buttons */
        nextPage.setDisabled(false)
        lastPage.setDisabled(false)
        if (!queuePaginate.hasPrevious()) {
          firstPage.setDisabled(true)
          previousPage.setDisabled(true)
        }
        /* Row of buttons! */
        const buttonRow = new MessageActionRow()
          .addComponents(firstPage, previousPage, nextPage, lastPage, pageJump)

        /* Rand out of room for the cancel button, so... */
        const cancelRow = new MessageActionRow()
          .addComponents(cancelButton)

        const components = songs.length === 0 || songs.length <= 10 ? [cancelRow] : [buttonRow, cancelRow]

        /* Making the embed. */
        queueEmbed.setDescription(`<:pMusic:815331262255595610> **Currently Playing:**\n${song.user} \`${song.formattedDuration}\`\n**[${song.name}](${song.url})**\n\n${queue ? `${queueMap}` : `${process.env.EMOJI_WARN} The queue is empty. Start adding some songs! 😉`}`)
        queueEmbed.setFooter(`${queue ? `Page ${queuePaginate.current} of ${queuePaginate.total}` : 'Queue is empty.'}`, message.author.avatarURL({ dynamic: true }))
        await interaction.message.edit({ embed: queueEmbed, components: components, allowedMentions: { repliedUser: false } })
        collector.resetTimer({
          time: 30000,
          idle: 30000
        })
      }

      // Previous Page Button
      if (interaction.customID === 'previous_page') {
        const paginateArray = queuePaginate.previous()

        /* Map the array. */
        const queueMap = paginateArray.map(song => `**${songs.indexOf(song) + 1}:**  [${song.name}](${song.url})\n${song.user} \`${song.formattedDuration}\``).join('\n\n')

        /* Need to make sure all buttons are available */
        nextPage.setDisabled(false)
        lastPage.setDisabled(false)
        firstPage.setDisabled(false)
        previousPage.setDisabled(false)
        if (!queuePaginate.hasPrevious()) {
          firstPage.setDisabled(true)
          previousPage.setDisabled(true)
        }
        /* Row of buttons! */
        const buttonRow = new MessageActionRow()
          .addComponents(firstPage, previousPage, nextPage, lastPage, pageJump)

        /* Rand out of room for the cancel button, so... */
        const cancelRow = new MessageActionRow()
          .addComponents(cancelButton)

        const components = songs.length === 0 || songs.length <= 10 ? [cancelRow] : [buttonRow, cancelRow]

        /* Making the embed. */
        queueEmbed.setDescription(`<:pMusic:815331262255595610> **Currently Playing:**\n${song.user} \`${song.formattedDuration}\`\n**[${song.name}](${song.url})**\n\n${queue ? `${queueMap}` : `${process.env.EMOJI_WARN} The queue is empty. Start adding some songs! 😉`}`)
        queueEmbed.setFooter(`${queue ? `Page ${queuePaginate.current} of ${queuePaginate.total}` : 'Queue is empty.'}`, message.author.avatarURL({ dynamic: true }))
        await interaction.message.edit({ embed: queueEmbed, components: components, allowedMentions: { repliedUser: false } })
        collector.resetTimer({
          time: 30000,
          idle: 30000
        })
      }

      // Next Page Button
      if (interaction.customID === 'next_page') {
        const paginateArray = queuePaginate.next()

        /* Map the array. */
        const queueMap = paginateArray.map(song => `**${songs.indexOf(song) + 1}:**  [${song.name}](${song.url})\n${song.user} \`${song.formattedDuration}\``).join('\n\n')

        /* Need to make sure all buttons are available */
        nextPage.setDisabled(false)
        lastPage.setDisabled(false)
        firstPage.setDisabled(false)
        previousPage.setDisabled(false)
        if (!queuePaginate.hasNext()) {
          nextPage.setDisabled(true)
          lastPage.setDisabled(true)
        }

        /* Row of buttons! */
        const buttonRow = new MessageActionRow()
          .addComponents(firstPage, previousPage, nextPage, lastPage, pageJump)

        /* Rand out of room for the cancel button, so... */
        const cancelRow = new MessageActionRow()
          .addComponents(cancelButton)

        const components = songs.length === 0 || songs.length <= 10 ? [cancelRow] : [buttonRow, cancelRow]

        /* Making the embed. */
        queueEmbed.setDescription(`<:pMusic:815331262255595610> **Currently Playing:**\n${song.user} \`${song.formattedDuration}\`\n**[${song.name}](${song.url})**\n\n${queue ? `${queueMap}` : `${process.env.EMOJI_WARN} The queue is empty. Start adding some songs! 😉`}`)
        queueEmbed.setFooter(`${queue ? `Page ${queuePaginate.current} of ${queuePaginate.total}` : 'Queue is empty.'}`, message.author.avatarURL({ dynamic: true }))
        await interaction.message.edit({ embed: queueEmbed, components: components, allowedMentions: { repliedUser: false } })
        collector.resetTimer({
          time: 30000,
          idle: 30000
        })
      }

      // Last Page Button
      if (interaction.customID === 'last_page') {
        const paginateArray = queuePaginate.last()

        /* Map the array. */
        const queueMap = paginateArray.map(song => `**${songs.indexOf(song) + 1}:**  [${song.name}](${song.url})\n${song.user} \`${song.formattedDuration}\``).join('\n\n')

        /* Enable and disable buttons */
        firstPage.setDisabled(false)
        previousPage.setDisabled(false)
        if (!queuePaginate.hasNext()) {
          nextPage.setDisabled(true)
          lastPage.setDisabled(true)
          collector.resetTimer({
            time: 30000,
            idle: 30000
          })
        }

        /* Row of buttons! */
        const buttonRow = new MessageActionRow()
          .addComponents(firstPage, previousPage, nextPage, lastPage, pageJump)

        /* Rand out of room for the cancel button, so... */
        const cancelRow = new MessageActionRow()
          .addComponents(cancelButton)

        const components = songs.length === 0 || songs.length <= 10 ? [cancelRow] : [buttonRow, cancelRow]

        /* Making the embed. */
        queueEmbed.setDescription(`<:pMusic:815331262255595610> **Currently Playing:**\n${song.user} \`${song.formattedDuration}\`\n**[${song.name}](${song.url})**\n\n${queue ? `${queueMap}` : `${process.env.EMOJI_WARN} The queue is empty. Start adding some songs! 😉`}`)
        queueEmbed.setFooter(`${queue ? `Page ${queuePaginate.current} of ${queuePaginate.total}` : 'Queue is empty.'}`, message.author.avatarURL({ dynamic: true }))
        await interaction.message.edit({ embed: queueEmbed, components: components, allowedMentions: { repliedUser: false } })
        collector.resetTimer({
          time: 30000,
          idle: 30000
        })
      }

      // Jump to Page Button
      if (interaction.customID === 'page_jump') {
        message.reply('What page do you wanna go to?').then(async pageMsg => {
          const filter = m => m.author.id === message.author.id && !isNaN(m.content)
          message.channel.awaitMessages(filter, {
            max: 1,
            time: 15000,
            errors: ['time']
          }).then(async collected => {
            const msg2 = collected.first()
            const pageNumber = parseInt(msg2.content)
            if (pageNumber >= queuePaginate.total) {
              const paginateArray = queuePaginate.last()

              /* Map the array. */
              const queueMap = paginateArray.map(song => `**${songs.indexOf(song) + 1}:**  [${song.name}](${song.url})\n${song.user} \`${song.formattedDuration}\``).join('\n\n')

              nextPage.setDisabled(false)
              lastPage.setDisabled(false)
              firstPage.setDisabled(false)
              previousPage.setDisabled(false)

              if (!queuePaginate.hasNext()) {
                nextPage.setDisabled(true)
                lastPage.setDisabled(true)
              }
              /* Row of buttons! */
              const buttonRow = new MessageActionRow()
                .addComponents(firstPage, previousPage, nextPage, lastPage, pageJump)

              /* Rand out of room for the cancel button, so... */
              const cancelRow = new MessageActionRow()
                .addComponents(cancelButton)

              const components = songs.length === 0 || songs.length <= 10 ? [cancelRow] : [buttonRow, cancelRow]

              /* Making the embed. */
              queueEmbed.setDescription(`<:pMusic:815331262255595610> **Currently Playing:**\n${song.user} \`${song.formattedDuration}\`\n**[${song.name}](${song.url})**\n\n${queue ? `${queueMap}` : `${process.env.EMOJI_WARN} The queue is empty. Start adding some songs! 😉`}`)
              queueEmbed.setFooter(`${queue ? `Page ${queuePaginate.current} of ${queuePaginate.total}` : 'Queue is empty.'}`, message.author.avatarURL({ dynamic: true }))
              await interaction.message.edit({ embed: queueEmbed, components: components, allowedMentions: { repliedUser: false } })
              msg2.delete()
              pageMsg.delete()
            } else if (pageNumber <= queuePaginate.total) {
              const paginateArray = queuePaginate.first()

              /* Map the array. */
              const queueMap = paginateArray.map(song => `**${songs.indexOf(song) + 1}:**  [${song.name}](${song.url})\n${song.user} \`${song.formattedDuration}\``).join('\n\n')

              nextPage.setDisabled(false)
              lastPage.setDisabled(false)
              firstPage.setDisabled(false)
              previousPage.setDisabled(false)

              if (!queuePaginate.hasPrevious()) {
                firstPage.setDisabled(true)
                previousPage.setDisabled(true)
              }

              /* Row of buttons! */
              const buttonRow = new MessageActionRow()
                .addComponents(firstPage, previousPage, nextPage, lastPage, pageJump)

              /* Rand out of room for the cancel button, so... */
              const cancelRow = new MessageActionRow()
                .addComponents(cancelButton)

              const components = songs.length === 0 || songs.length <= 10 ? [cancelRow] : [buttonRow, cancelRow]

              /* Making the embed. */
              queueEmbed.setDescription(`<:pMusic:815331262255595610> **Currently Playing:**\n${song.user} \`${song.formattedDuration}\`\n**[${song.name}](${song.url})**\n\n${queue ? `${queueMap}` : `${process.env.EMOJI_WARN} The queue is empty. Start adding some songs! 😉`}`)
              queueEmbed.setFooter(`${queue ? `Page ${queuePaginate.current} of ${queuePaginate.total}` : 'Queue is empty.'}`, message.author.avatarURL({ dynamic: true }))
              await interaction.message.edit({ embed: queueEmbed, components: components, allowedMentions: { repliedUser: false } })
              msg2.delete()
              pageMsg.delete()
            }

            const paginateArray = queuePaginate.page(pageNumber)
            /* Map the array. */
            const queueMap = paginateArray.map(song => `**${songs.indexOf(song) + 1}:**  [${song.name}](${song.url})\n${song.user} \`${song.formattedDuration}\``).join('\n\n')

            nextPage.setDisabled(false)
            lastPage.setDisabled(false)
            firstPage.setDisabled(false)
            previousPage.setDisabled(false)

            if (!queuePaginate.hasPrevious()) {
              firstPage.setDisabled(true)
              previousPage.setDisabled(true)
            } else if (!queuePaginate.hasNext()) {
              nextPage.setDisabled(true)
              lastPage.setDisabled(true)
            }

            /* Row of buttons! */
            const buttonRow = new MessageActionRow()
              .addComponents(firstPage, previousPage, nextPage, lastPage, pageJump)

            /* Rand out of room for the cancel button, so... */
            const cancelRow = new MessageActionRow()
              .addComponents(cancelButton)

            const components = songs.length === 0 || songs.length <= 10 ? [cancelRow] : [buttonRow, cancelRow]

            /* Making the embed. */
            queueEmbed.setDescription(`<:pMusic:815331262255595610> **Currently Playing:**\n${song.user} \`${song.formattedDuration}\`\n**[${song.name}](${song.url})**\n\n${queue ? `${queueMap}` : `${process.env.EMOJI_WARN} The queue is empty. Start adding some songs! 😉`}`)
            queueEmbed.setFooter(`${queue ? `Page ${queuePaginate.current} of ${queuePaginate.total}` : 'Queue is empty.'}`, message.author.avatarURL({ dynamic: true }))
            await interaction.message.edit({ embed: queueEmbed, components: components, allowedMentions: { repliedUser: false } })
            msg2.delete()
            pageMsg.delete()
            collector.resetTimer({
              time: 30000,
              idle: 30000
            })
          }).catch(async () => {
            await pageMsg.delete()
          })
        })
      }

      // Cancel Button
      if (interaction.customID === 'cancel_button') {
        collector.stop()
        await msg.delete()
        return message.react(process.env.REACTION_OK)
      }
    })

    collector.on('end', async () => {
      await msg.edit({ components: [] })
    })

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
        .setDescription(`<:pMusic:815331262255595610>**Currently Playing:**\n${song.user} \`${song.formattedDuration}\`\n**[${song.name}](${song.url})**`)
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
            .setDescription(`<:pMusic:815331262255595610> **Currently Playing:**\n${song.user} \`${song.formattedDuration}\`\n**[${song.name}](${song.url})**`)
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
