const { Listener } = require('discord-akairo');

module.exports = class CommandBlockedListener extends Listener {
    constructor () {
        super('commandBlocked', {
            emitter: 'commandHandler',
            event: 'commandBlocked'
        });
    }

    async exec (command, promise, ctx) {
        this.client.settings.ensure(ctx.guildID, this.client.defaultSettings);
    }
};
