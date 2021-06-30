const { Command } = require('discord-akairo')
const { MessageButton, MessageActionRow } = require('discord.js')

module.exports = class CommandResetData extends Command {
  constructor () {
    super('resetmusicdata', {
      aliases: ['resetmusicdata'],
      category: '⚙ Settings',
      description: {
        text: 'Allows you to reset the bot\'s music settings for this server.'
      },
      channel: 'guild',
      userPermissions: ['ADMINISTRATOR']
    })
  }

  async exec (message) {
    const yesButton = new MessageButton()
      .setStyle('SUCCESS')
      .setLabel('Yes')
      .setEmoji(process.env.EMOJI_OK)
      .setCustomID('yes_data')

    const noButton = new MessageButton()
      .setStyle('DANGER')
      .setLabel('No')
      .setEmoji(process.env.EMOJI_ERROR)
      .setCustomID('no_data')

    const buttonRow = new MessageActionRow().addComponents(yesButton, noButton)

    const msg = await message.say('warn', 'You are about to revert the bot\'s music settings for this server to defaults. Are you sure you want to do this?', 'Warning', null, [buttonRow])

    const filter = interaction => interaction.user.id === message.author.id

    const collector = await msg.createMessageComponentInteractionCollector(filter, {
      time: 30000
    })

    collector.on('collect', async interaction => {
      if (interaction.customID === 'yes_data') {
        interaction.defer()
        msg.delete()
        await this.client.settings.clear(interaction.guild.id)
        collector.stop()
        message.say('ok', 'The settings for this server have been cleared.')
      }

      if (interaction.customID === 'no_data') {
        collector.stop()
        await msg.delete()
        return message.react(process.env.REACTION_OK)
      }
    })

    collector.on('end', () => msg.delete())
  }
}
