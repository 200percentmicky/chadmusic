const { Listener } = require('discord-akairo');

module.exports = class ListenerClientDebug extends Listener {
    constructor () {
        super('debug', {
            emitter: 'client',
            event: 'debug'
        });
    }

    async exec (debug) {
        if (process.env.DEBUG_LOGGING === 'true') {
            this.client.logger.info('[Client] [DEBUG] %s', debug);
        }
    }
};
