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
    const guru = stripIndents`
    💢 **Bruh Moment**
    An error report was sent to the bot owner.
    \`\`\`js
    ${error.name}: ${error.message}
    \`\`\`
    `;
    message.reply(guru, { allowedMentions: { repliedUser: true } });
    this.client.ui.recordError(message, 'error', command, 'Command Error', error.stack);
  }
};
