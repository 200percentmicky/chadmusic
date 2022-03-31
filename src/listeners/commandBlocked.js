const { Listener } = require('discord-akairo');

module.exports = class CommandBlockedListener extends Listener {
    constructor () {
        super('commandBlocked', {
            emitter: 'commandHandler',
            event: 'commandBlocked'
        });
    }

    async exec (message, command, reason) {
        if (reason === 'owner') return this.client.ui.reply(message, 'no', 'That command can only be used by the bot owner.');
        if (reason === 'guild') return this.client.ui.reply(message, 'error', 'That command must be used in a server.');
        if (reason === 'dm') return this.client.ui.reply(message, 'error', 'That command must be used in a Direct Message.');
    }
};
