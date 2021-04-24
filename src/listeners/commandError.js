const { Listener } = require('discord-akairo')
const { MessageEmbed } = require('discord.js')
const { stripIndents } = require('common-tags')

module.exports = class ListenerCommandError extends Listener {
  constructor () {
    super('commandError', {
      emitter: 'commandHandler',
      event: 'error'
    })
  }

  async exec (error, message, command) {
    // Normally presented in an embed. I wanna make it look pretty!
    const perms = message.channel.permissionsFor(this.client.user.id).has(['EMBED_LINKS'])
    if (perms) {
      const guru = new MessageEmbed()
        .setColor(process.env.COLOR_ERROR)
        .setTitle('🧘‍♀️ Guru Meditation')
        .setDescription(`Something bad happened while executing \`${command.id}\`.\n\`\`\`js\n${error.name}: ${error.message}\`\`\``)
        .setFooter('An error report was sent to the bot owner.')
      message.reply({ embed: guru, allowedMentions: { repliedUser: false } })
    } else {
      const guru = stripIndents`
      :woman_in_lotus_position: **Guru Meditation**
      Something bad happened while executing \`${command.id}\`. An error report was sent to the bot owner.
      \`\`\`js
      ${error.name}: ${error.message}
      \`\`\`
      `
      message.reply(guru, { allowedMentions: { repliedUser: false } })
    }
    message.recordError('error', command, 'Command Error', error.stack)
  }
}
