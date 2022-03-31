const { Listener } = require('discord-akairo');

module.exports = class ListenerProcessUnhandledRejection extends Listener {
    constructor () {
        super('unhandledRejection', {
            emitter: 'process',
            event: 'unhandledRejection'
        });
    }

    async exec (error) {
        this.client.logger.error(error.stack);
    }
};
