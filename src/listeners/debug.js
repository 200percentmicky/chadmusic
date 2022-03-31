const { Listener } = require('discord-akairo');

module.exports = class ListenerDebug extends Listener {
    constructor () {
        super('debug', {
            emitter: 'client',
            event: 'debug'
        });
    }

    async exec (debug) {
        if (process.env.DEBUG_LOGGING === 'true') {
            this.client.logger.info('[DEBUG] %s', debug);
        }
    }
};
