const { stripIndent } = require('common-tags')
const { Command } = require('discord-akairo')

module.exports = class CommandCreateTag extends Command {
  constructor () {
    super('createtag', {
      aliases: ['createtag', 'ct'],
      category: '🔖 Tags',
      description: {
        text: 'Create a new tag.',
        usage: '<name> <content>',
        details: stripIndent`
        \`<name>\` The name of the tag.
        \`<content>\` The content to include in the tag.
        `
      },
      channel: 'guild'
    })
  }

  async exec (message) {
    const args = message.content.split(/ +/g)
    const text = args.slice(2).join(' ')
    if (!args[1]) {
      return this.client.ui.usage(message, 'createtag <name> <content>')
    }

    const tag = await this.client.tags.get(`${message.guild.id}.${args[1]}`)
    if (!tag) {
      await this.client.tags.set(`${message.guild.id}.${args[1]}`, {
        text: text,
        creator: message.author.id
      })
      if (this.client.settings.get(message.guild.id, 'taglog')) {
        const tagLog = message.guild.channels.cache.get(this.client.settings.get(message.guild.id, 'taglog'))
        return tagLog.send(stripIndent`
        🏷 **${message.author.tag}** (ID: ${message.author.id}) created a new tag: \`${args[1]}\`.
        >>> ${text}
        `) // May convert this into an embed later, but this will do.
      }
      return this.client.ui.say(message, 'ok', `Created the tag \`${args[1]}\`.`)
    } else {
      return this.client.ui.say(message, 'warn', `\`${args[1]}\` is already a tag on this server.`)
    }
  }
}
