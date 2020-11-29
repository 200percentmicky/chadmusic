const { Listener } = require('discord-akairo');

module.exports = class ListenerGetPrefix extends Listener
{
    constructor()
    {
        super('getPrefix', {
            emitter: 'client',
            event: 'message'
        });
    }

    async exec(message)
    {
        if (message.content === this.client.user.toString() || message.content === `<@!${this.client.user.id}>`)
        {
            const prefix = this.client.prefix.getPrefix(message.guild.id) ? this.client.prefix.getPrefix(message.guild.id) : this.client.config.prefix;
            return message.channel.send(`:information_source: My prefix for **${message.guild.name}** is \`${prefix}\``);
        }
    }

};
