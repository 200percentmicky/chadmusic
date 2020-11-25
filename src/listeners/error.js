const { Listener } = require('discord-akairo');

module.exports = class ListenerClientError extends Listener
{
    constructor()
    {
        super('clientError', {
            emitter: 'client',
            event: 'error'
        });
    }

    async exec(error)
    {
        var timestamp = `[${this.client.moment(new Date()).format('YYYY-MM-DD HH:mm:ss')}] `;
        console.log(timestamp + this.client.errorlog + error);
    }

};
