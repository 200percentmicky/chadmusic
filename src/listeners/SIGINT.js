const { Listener } = require('discord-akairo');

module.exports = class ListenerSIGINT extends Listener {
    constructor () {
        super('SIGINT', {
            emitter: 'process',
            event: 'SIGINT'
        });
    }

    async exec () {
        this.client.logger.warn('SIGINT received!');
        this.client.logger.warn('Shutting down...');
        this.client.destroy();
        process.exit(0);
    }
};
