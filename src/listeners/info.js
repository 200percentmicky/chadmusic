const { Listener } = require('discord-akairo');

module.exports = class ListenerInfo extends Listener
{
    constructor()
    {
        super('info', {
            emitter: 'client',
            event: 'info'
        });
    }

    async exec(info)
    {
        var timestamp = `[${this.client.moment(new Date()).format('YYYY-MM-DD HH:mm:ss')}] `;
        console.log(timestamp + this.client.infolog + info);
    }

};
