const { Listener } = require('discord-akairo');
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
    Something bad happened. Check the console or logs for details.
    \`\`\`js
    ${error.name}: ${error.message}
    \`\`\`
    `;
        message.reply({ content: guru, allowedMentions: { repliedUser: true } });
        this.client.ui.recordError(this.client, command, '❌ Command Error', error.stack);
        this.client.logger.error('Error in command "%s": %s', command, error.stack);
    }
};
