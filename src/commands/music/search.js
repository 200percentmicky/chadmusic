const { Command } = require('discord-akairo')
const { MessageEmbed } = require('discord.js')
const { Permissions } = require('discord.js')

module.exports = class CommandSearch extends Command {
  constructor () {
    super('search', {
      aliases: ['search'],
      category: '🎶 Music',
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
    const djMode = this.client.settings.get(message.guild.id, 'djMode')
    const djRole = this.client.settings.get(message.guild.id, 'djRole')
    const dj = message.member.roles.cache.has(djRole) || message.channel.permissionsFor(message.member.user.id).has(['MANAGE_CHANNELS'])
    if (djMode) {
      if (!dj) return message.say('no', 'DJ Mode is currently active. You must have the DJ Role or the **Manage Channels** permission to use music commands at this time.', 'DJ Mode')
    }

    const vc = message.member.voice.channel
    if (!vc) return message.say('error', 'You are not in a voice channel.')

    message.channel.startTyping()
    const currentVc = this.client.voice.connections.get(message.guild.id)
    if (!currentVc) {
      const permissions = vc.permissionsFor(this.client.user.id).has(['CONNECT'])
      if (!permissions) return message.say('no', `Missing **Connect** permission for <#${vc.id}>`)

      if (vc.type === 'stage') {
        await vc.join() // Must be awaited only if the VC is a Stage Channel.
        const stageMod = vc.permissionsFor(this.client.user.id).has(Permissions.STAGE_MODERATOR)
        if (!stageMod) {
          const requestToSpeak = vc.permissionsFor(this.client.user.id).has(['REQUEST_TO_SPEAK'])
          if (!requestToSpeak) {
            vc.leave()
            return message.say('no', `Missing **Request to Speak** permission for <#${vc.id}>.`)
          } else if (message.guild.me.voice.suppress) {
            await message.guild.me.voice.setRequestToSpeak(true)
            message.say('info', `Since I'm not a **Stage Moderator** for <#${vc.id}>, please accept my request to speak on stage.`)
          }
        } else {
          await message.guild.me.voice.setSuppressed(false)
        }
      } else {
        vc.join()
      }
    } else {
      if (vc.id !== currentVc.channel.id) return message.say('error', 'You must be in the same voice channel that I\'m in to use that command.')
    }

    message.channel.startTyping()
    const queue = this.client.player.getQueue(message.guild.id)

    if (!args[1]) return message.usage('search <query>')

    // These limitations should not affect a member with DJ permissions.
    if (!dj) {
      if (queue) {
        const maxQueueLimit = await this.client.maxQueueLimit.get(message.guild.id)
        if (maxQueueLimit) {
          const queueMemberSize = queue.songs.filter(entries => entries.user.id === message.member.user.id).length
          if (queueMemberSize >= maxQueueLimit) {
            message.say('no', `You are only allowed to add a max of ${maxQueueLimit} entr${maxQueueLimit === 1 ? 'y' : 'ies'} to the queue.`)
            return message.channel.stopTyping(true)
          }
        }
      }
    }

    message.channel.startTyping()
    this.client.player.search(search).then(results => {
      const resultMap = results.slice(0, 10).map(result => `${results.indexOf(result) + 1}: \`${result.formattedDuration}\` [${result.name}](${result.url})`).join('\n\n')
      const embed = new MessageEmbed()
        .setColor(this.client.utils.randColor())
        .setAuthor('Which track do you wanna play?', message.author.avatarURL({ dynamic: true }))
        .setDescription(`${resultMap}`)
        .setFooter('Type the number of your selection, or type "cancel" if you changed your mind.')

      message.channel.send({ embeds: [embed] }).then(msg => {
        const filter = m => m.author.id === message.author.id && (!isNaN(m.content) || m.content === 'CANCEL'.toLowerCase())
        message.channel.awaitMessages(filter, {
          max: 1,
          time: 30000,
          errors: ['time']
        }).then(async collected => {
          msg.delete()
          collected.first().delete()
          if (collected.first().content === 'CANCEL'.toLowerCase()) return
          message.channel.startTyping(5)
          let selected = results[parseInt(collected.first().content - 1)].url
          if (collected.first().content > 10) {
            selected = results[9].url
            message.say('info', `Your input was \`${collected.first().content}\`. The 10th result was queued instead.`)
          } else if (collected.first().content <= 0) {
            selected = results[0].url
            message.say('info', `Your input was \`${collected.first().content}\`. The 1st result was queued instead.`)
          }
          await this.client.player.play(message, selected)
          message.react(process.env.REACTION_OK)
          return message.channel.stopTyping(true)
        }).catch(() => {
          return msg.delete()
        })
      })
    })

    return message.channel.stopTyping(true)
  }
}
