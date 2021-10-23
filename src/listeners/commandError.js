const { Listener } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');

module.exports = class ListenerCommandError extends Listener {
  constructor () {
    super('commandError', {
      emitter: 'commandHandler',
      event: 'error'
    });
  }

  async exec (error, message, command) {
    // Normally presented in an embed. I wanna make it look pretty!
    const perms = message.channel.permissionsFor(this.client.user.id).has(['EMBED_LINKS']);
    if (perms) {
      const guru = new MessageEmbed()
        .setColor(0xFF0000)
        .setTitle('💢 Bruh Moment')
        .setDescription(`Something bad happened while executing \`${command.id}\`.\n\`\`\`js\n${error.name}: ${error.message}\`\`\``)
        .setFooter('An error report was sent to the bot owner.');
      message.reply({ embeds: [guru], allowedMentions: { repliedUser: true } });
    } else {
      const guru = stripIndents`
      💢 **Bruh Moment**
      Something bad happened while executing \`${command.id}\`. An error report was sent to the bot owner.
      \`\`\`js
      ${error.name}: ${error.message}
      \`\`\`
      `;
      message.reply(guru, { allowedMentions: { repliedUser: true } });
    }
    this.client.ui.recordError(message, 'error', command, 'Command Error', error.stack);
  }
};
