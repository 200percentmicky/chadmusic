const { Listener } = require('discord-akairo');

module.exports = class ListenerClientCommandStarted extends Listener {
    constructor () {
        super('clientCommandStarted', {
            emitter: 'commandHandler',
            event: 'commandStarted'
        });
    }

    async exec (message, command, args) {
        this.client.settings.ensure(message.guild.id, this.client.defaultSettings);
    }
};
