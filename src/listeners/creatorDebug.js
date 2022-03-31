const { Listener } = require('discord-akairo');

module.exports = class ListenerCreatorDebug extends Listener {
    constructor () {
        super('creatorDebug', {
            emitter: 'creator',
            event: 'debug'
        });
    }

    async exec (debug) {
        if (process.env.DEBUG_LOGGING === 'true') {
            this.client.logger.info('[SlashCreator] [DEBUG] %s', debug);
        }
    }
};
