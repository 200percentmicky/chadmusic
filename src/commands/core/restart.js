const { Command } = require('discord-akairo')
const { MessageEmbed } = require('discord.js')
const { restart } = require('../../aliases.json')

module.exports = class CommandRestart extends Command {
  constructor () {
    super(restart !== undefined ? restart[0] : 'restart', {
      aliases: restart || ['restart'],
      ownerOnly: true,
      category: '💻 Core',
      description: {
        text: 'Attempts to restart the bot.',
        usage: '[reason]',
        details: '`[reason]` The reason for the restarting the bot.'
      }
    })
  }

  async exec (message) {
    const args = message.content.split(/ +/g)
    let restartReport = args.slice(1).join(' ')
    if (!restartReport) restartReport = 'Just refreshing... nothing serious. :3'
    const errChannel = this.client.channels.cache.find(val => val.id === process.env.BUG_CHANNEL)
    await message.react('🔄')
    const embed = new MessageEmbed()
      .setColor(process.env.COLOR_INFO)
      .setTitle('🔁 Restart')
      .setDescription(`\`\`\`js\n${restartReport}\`\`\``)
      .setTimestamp()
    await errChannel.send({ embeds: [embed] })
    this.client.logger.info('[Restart] %s', restartReport)
    this.client.logger.warn('Shutting down...')
    this.client.destroy()
    process.exit(0)
  }
}
