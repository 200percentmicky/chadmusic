const { Listener } = require('discord-akairo');

module.exports = class ListenerProcessUnhandledException extends Listener {
    constructor () {
        super('unhandledException', {
            emitter: 'process',
            event: 'unhandledException'
        });
    }

    async exec (error) {
        this.client.logger.error('[process] [FATAL] %s', error.stack);
        this.client.logger.error('A fatal exception occurred in the process. Shutting down...');
        process.exit(1);
    }
};
