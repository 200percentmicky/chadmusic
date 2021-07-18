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
    if (!args[0]) {
      return message.usage('createtag <name> <content>')
    }

    const tag = this.client.tags.get(args[1])
    if (!tag) {
      await this.client.tags.set(message.guild.id, {
        text: text,
        creator: message.author.id,
        tag_name: args[1]
      }, args[1])
      message.say('ok', `Created the tag \`${args[1]}\`.`)
      if (this.client.settings.get(message.guild.id, 'taglog')) {
        const tagLog = message.guild.channels.cache.get(this.client.settings.get(message.guild.id, 'taglog'))
        return tagLog.send(stripIndent`
        🏷 **${message.author.tag}** (ID: ${message.author.id}) created a new tag: \`${args[1]}\`.
        >>> ${text}
        `) // May convert this into an embed later, but this will do.
      }
    } else {
      return message.say('warn', `\`${args[1]}\` is already a tag on this server.`)
    }
  }
}
