const { stripIndents } = require('common-tags')
const { Command } = require('discord-akairo')

module.exports = class CommandResetData extends Command {
  constructor () {
    super('resetdata', {
      aliases: ['resetdata'],
      category: '🛠 Utilities',
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
        await message.say('warn', 'You are about to revert the bot\'s settings for this server to defaults. Are you sure you want to do this?', 'Warning').then(msg => {
          const filter = (reaction, user) => {
            return [process.env.REACTION_OK, process.env.REACTION_ERROR].includes(reaction.emoji.name) && user.id === message.author.id
          }

          msg.react(process.env.REACTION_OK)
          msg.react(process.env.REACTION_ERROR)

          msg.awaitReactions(filter, {
            max: 1,
            time: 30000,
            errors: ['time']
          }).then(async collected => {
            const reaction = collected.first()

            if (reaction.emoji.name === process.env.REACTION_OK) {
              msg.delete()
              message.channel.startTyping()
              await this.client.settings.clear(message.guild.id)
              message.say('ok', 'All settings have been reverted to defaults.')
              message.channel.stopTyping(true)
            } else {
              msg.delete()
            }
          }).catch(() => {
            msg.delete()
          })
        })
        break
      }

      case 'modlog': {
        await message.say('warn', 'You are about to reset the case count for this server. Are you sure you want to do this?', 'Warning').then(msg => {
          const filter = (reaction, user) => {
            return [process.env.REACTION_OK, process.env.REACTION_ERROR].includes(reaction.emoji.name) && user.id === message.author.id
          }

          msg.react(process.env.REACTION_OK)
          msg.react(process.env.REACTION_ERROR)

          msg.awaitReactions(filter, {
            max: 1,
            time: 30000,
            errors: ['time']
          }).then(async collected => {
            const reaction = collected.first()

            if (reaction.emoji.name === process.env.REACTION_OK) {
              msg.delete()
              message.channel.startTyping()
              await this.client.modlog.clear(message.guild.id)
              message.say('ok', 'The modlog\'s case count has been reset.')
              message.channel.stopTyping(true)
            } else {
              msg.delete()
            }
          }).catch(() => {
            msg.delete()
          })
        })
        break
      }
    }
  }
}
