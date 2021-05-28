const { stripIndent } = require('common-tags')
const { Command } = require('discord-akairo')

module.exports = class CommandDeleteTag extends Command {
  constructor () {
    super('deletetag', {
      aliases: ['deletetag', 'dt'],
      category: '🔖 Tags',
      description: {
        text: 'Deletes a tag.',
        usage: '<name>',
        details: stripIndent`
        \`<name>\` The name of the tag.
        `
      },
      channel: 'guild'
    })
  }

  async exec (message) {
    const args = message.content.split(/ +/g)
    if (!args[1]) {
      return message.usage('deletetag <name>')
    }

    const tag = this.client.tags.get(message.guild.id, args[1])
    if (!tag) return message.say('warn', `The tag \`${args[1]}\` does not exist on this server.`)
    if (message.author.id !== tag.user_id) {
      if (message.channel.permissionsFor(message.author.id).has(['MANAGE_GUILD'])) {
        if (this.client.settings.get(message.guild.id, 'taglog')) {
          const tagLog = message.guild.channels.cache.get(this.client.settings.get(message.guild.id, 'taglog'))
          tagLog.send(`🏷 **${message.author.tag}** (ID: ${message.author.id}) deleted the tag: \`${args[1]}\`.`) // May convert this into an embed later, but this will do.
        }
        await this.client.tags.delete(message.guild.id, args[1])
        return message.say('ok', `Deleted the tag \`${args[1]}\`.`)
      } else {
        return message.say('no', 'That\'s not your tag. Only members with the **Manage Server** permission can delete other tags.')
      }
    } else {
      await this.client.tags.delete(message.guild.id, args[1])
      message.say('ok', `Deleted the tag \`${args[1]}\`.`)
      if (this.client.settings.get(message.guild.id, 'taglog')) {
        const tagLog = message.guild.channels.cache.get(this.client.settings.get(message.guild.id, 'taglog'))
        return tagLog.send(`🏷 **${message.author.tag}** (ID: ${message.author.id}) deleted the tag: \`${args[1]}\`.`)
      }
    }
  }
}
