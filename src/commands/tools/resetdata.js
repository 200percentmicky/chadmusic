const { stripIndents } = require('common-tags')
const { Command } = require('discord-akairo')
const { MessageButton, MessageActionRow } = require('discord.js')

module.exports = class CommandResetData extends Command {
  constructor () {
    super('resetdata', {
      aliases: ['resetdata'],
      category: '🔧 Tools',
      description: {
        text: 'Allows you to reset the bot\'s data for this guild.',
        usage: '<type>',
        details: stripIndents`
        \`<type>\` The type of data you would like to reset.

        **Available Types**
        \`modlog\` Resets the modlog case count.
        \`settings\` Resets the bot's settings for this guild to defaults.
        `
      },
      channel: 'guild',
      userPermissions: ['ADMINISTRATOR']
    })
  }

  async exec (message) {
    const args = message.content.split(/ +/g)

    if (!args[1]) return message.usage('resetdata <type>')

    switch (args[1]) {
      case 'settings': {
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

        const msg = await message.say('warn', 'You are about to revert the bot\'s settings for this server to defaults. Are you sure you want to do this?', 'Warning', [buttonRow])

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
        break
      }

      case 'modlog': {
        const yesButton = new MessageButton()
          .setStyle('SUCCESS')
          .setLabel('Yes')
          .setEmoji(process.env.EMOJI_OK)
          .setCustomID('yes_modlog')

        const noButton = new MessageButton()
          .setStyle('DANGER')
          .setLabel('No')
          .setEmoji(process.env.EMOJI_ERROR)
          .setCustomID('no_modlog')

        const buttonRow = new MessageActionRow().addComponents(yesButton, noButton)

        const msg = await message.say('warn', 'You are about to reset the moderation case count for this server. Are you sure you want to do this?', 'Warning', [buttonRow])

        const filter = interaction => interaction.user.id === message.author.id

        const collector = await msg.createMessageComponentInteractionCollector(filter, {
          time: 30000
        })

        collector.on('collect', async interaction => {
          if (interaction.customID === 'yes_modlog') {
            interaction.defer()
            msg.delete()
            await this.client.modlog.set(interaction.guild.id, [])
            collector.stop()
            message.say('ok', 'The modlog case count in this server has been reset.')
          }

          if (interaction.customID === 'no_modlog') {
            collector.stop()
            await msg.delete()
            return message.react(process.env.REACTION_OK)
          }
        })

        collector.on('end', () => msg.delete())
        break
      }
    }
  }
}
