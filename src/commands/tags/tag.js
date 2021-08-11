const { stripIndent } = require('common-tags')
const { Command } = require('discord-akairo')

module.exports = class CommandTag extends Command {
  constructor () {
    super('tag', {
      aliases: ['tag', 't'],
      category: '🔖 Tags',
      description: {
        text: 'View a tag.',
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
    if (!args[0]) return this.client.ui.usage(message, 'tag <name>')

    const tag = await this.client.tags.get(`${message.guild.id}.${args[1]}`)
    if (!tag) return this.client.ui.say(message, 'error', `\`${args[1]}\` is not a valid tag on this server.`)
    return message.channel.send(`${tag.text}`)
  }
}
