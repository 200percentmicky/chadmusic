const { Command } = require('discord-akairo')
const { MessageEmbed } = require('discord.js')
const { Embeds } = require('discord-paginationembed')

module.exports = class CommandNukeChannel extends Command {
  constructor () {
    super('nukechannel', {
      aliases: ['nukechannel', 'nuke'],
      category: '🔑 Administration',
      description: {
        text: 'Nukes all messages in a channel.'
      },
      channel: 'guild',
      userPermissions: ['MANAGE_CHANNELS'],
      clientPermissions: ['MANAGE_CHANNELS']
    })
  }

  exec (message) {
    const embeds = []

    for (let i = 1; i <= 1; ++i) {
      embeds.push(new MessageEmbed()
        .setColor(this.client.color.warn)
        .addField(`${this.client.emoji.warn} Are you sure you want to nuke this channel?`, 'Nuking this channel will delete all messages! This action is irreversable.')
        .addField('\u200b', '✅ Nuke this channel!\n❌ Cancel. I changed my mind.'))
    }

    const embed = new Embeds()
      .setArray(embeds)
      .setAuthorizedUsers(message.author.id)
      .setChannel(message.channel)
      .setFunctionEmojis({
        '✅': async () => {
          await message.channel.clone({
            name: message.channel.name,
            type: 'text',
            topic: message.channel.topic,
            reason: `${message.author.tag} nuked this channel.`
          })
          await message.channel.delete()
        },
        '❌': () => {
          return embed.delete()
        }
      })
      .setDisabledNavigationEmojis(['all'])
      .setDeleteOnTimeout(true)
      .setTimeout(30000)
      .on('error', (err) => {
        // embed.delete() is not a function. But, ignore it since
        // it's a function of Message.
        // Also, ignore any Discord API Errors.
        if (err.name === 'TypeError' || err.name === 'DiscordAPIError') return
        message.recordError('error', 'nukechannel', 'Command Error', err.stack)
      })
      .on('finish', () => { })

    embed.build()
  }
}
