const { Listener } = require('discord-akairo');

module.exports = class ListenerGuildCreate extends Listener {
    constructor () {
        super('guildCreate', {
            emitter: 'client',
            event: 'guildCreate'
        });
    }

    async exec (guild) {
        this.client.settings.ensure(guild.id, this.client.defaultSettings);
    }
};
