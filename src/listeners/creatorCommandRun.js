const { Listener } = require('discord-akairo');

module.exports = class ListenerCreatorCommandRun extends Listener {
    constructor () {
        super('creatorCommandRun', {
            emitter: 'creator',
            event: 'commandRun'
        });
    }

    async exec (command, promise, ctx) {
        this.client.settings.ensure(ctx.guildID, this.client.defaultSettings);
    }
};
