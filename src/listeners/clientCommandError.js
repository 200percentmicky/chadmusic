const { Listener } = require('discord-akairo');

module.exports = class ListenerClientCommandError extends Listener {
    constructor () {
        super('clientCommandError', {
            emitter: 'commandHandler',
            event: 'error'
        });
    }

    async exec (error, message, command) {
        const guru = `💢 **Bruh Moment**\nSomething bad happened. Please report this to the developer.\n\`\`\`js\n${error.stack}\`\`\``;
        message.reply({ content: guru, allowedMentions: { repliedUser: true } });
        this.client.ui.recordError(this.client, command, '❌ Command Error', error.stack);
        this.client.logger.error('[Client] Error in command "%s": %s', command, error.stack);
    }
};
