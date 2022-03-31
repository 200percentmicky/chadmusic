const { Listener } = require('discord-akairo');

module.exports = class ListenerCreatorCommandError extends Listener {
    constructor () {
        super('creatorCommandError', {
            emitter: 'creator',
            event: 'commandError'
        });
    }

    async exec (command, err, ctx) {
        const guru = `💢 **Bruh Moment**\nSomething bad happened. Please report this to the developer.\n\`\`\`js\n${err.stack}\`\`\``;
        ctx.send(guru, { ephemeral: true });
        this.client.ui.recordError(this.client, command.commandName, '❌ Command Error', err.stack);
        this.client.logger.error('[SlashCreator] Error in command "%s": %s', command.commandName, err.stack);
    }
};
