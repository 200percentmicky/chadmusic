const { Command } = require('discord-akairo')
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js')

module.exports = class CommandTest extends Command {
  constructor () {
    super('test', {
      aliases: ['test'],
      category: '💻 Core',
      description: {
        text: 'Test command. Doesn\'t really do anything lmao'
      }
    })
  }

  async exec (message) {
    const args = message.content.split(/ +/g)

    switch (args[1]) {
      case 'error': {
        const e = new Error('Successfully threw an error. How did I do? :3')
        e.name = 'GuruMeditationTest'
        throw e
      }

      case 'pog': {
        const text = 'poggers'.repeat(500)
        const arr = text.match(/.{1,2048}/g) // Build the array

        for (const chunk of arr) { // Loop through every element
          const embed = new MessageEmbed()
            .setColor(this.client.utils.randColor())
            .setDescription(`${chunk}`)

          await message.channel.send({ embeds: [embed] }) // Wait for the embed to be sent
        }
        break
      }

      case 'button': {
        const actionRow = new MessageActionRow()
          .addComponents(
            new MessageButton()
              .setStyle('PRIMARY')
              .setLabel('This button does nothing.')
              .setDisabled(true),
            new MessageButton()
              .setStyle('DANGER')
              .setLabel('Click here to end the world!')
              .setEmoji('💣')
          )
        message.channel.send('Buttons', { components: [actionRow] })
        break
      }

      default: {
        message.say('ok', 'Yay! I\'m working as I should! What was I suppose to do again? 😗')
      }
    }
  }
}
