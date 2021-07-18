const { Command } = require('discord-akairo')
const { MessageButton, MessageActionRow, Permissions } = require('discord.js')

module.exports = class CommandNukeChannel extends Command {
  constructor () {
    super('nukechannel', {
      aliases: ['nukechannel', 'nuke'],
      category: '🔧 Tools',
      description: {
        text: 'Nukes all messages in a channel.'
      },
      channel: 'guild',
      userPermissions: ['MANAGE_CHANNELS']
    })
  }

  async exec (message) {
    if (!message.guild.me.permissions.any(Permissions.FLAGS.MANAGE_CHANNELS)) {
      // Must be guild wide.
      return message.say('warn', 'I require one of my roles to have the **Manage Channel** permission for this command to work properly.')
    }

    const nukeButton = new MessageButton()
      .setCustomID('nuke_yes')
      .setStyle('SUCCESS')
      .setLabel('Nuke this channel!')
      .setEmoji('☢')

    const cancelButton = new MessageButton()
      .setCustomID('nuke_no')
      .setStyle('DANGER')
      .setLabel('Cancel')
      .setEmoji(process.env.EMOJI_ERROR)

    const buttonRow = new MessageActionRow()
      .addComponents(nukeButton, cancelButton)

    const msg = await message.say('warn', 'Nuking this channel will delete all messages sent here. This action cannot be undone. Do you wish to proceed?', 'Warning', null, [buttonRow])

    const filter = interaction => interaction.user.id === message.author.id

    const collector = await msg.createMessageComponentInteractionCollector(filter, {
      time: 30000
    })

    collector.on('collect', async interaction => {
      if (interaction.customID === 'nuke_yes') {
        await message.channel.clone({
          name: message.channel.name,
          type: 'text',
          topic: message.channel.topic,
          reason: `${message.author.tag} nuked this channel.`
        })
        await message.channel.delete()
      }

      if (interaction.customID === 'nuke_no') {
        collector.stop()
        await msg.delete()
        return message.react(process.env.REACTION_OK)
      }
    })

    collector.on('end', () => msg.delete())
    /*
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
    */
  }
}
