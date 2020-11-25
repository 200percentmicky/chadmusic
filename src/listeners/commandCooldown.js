const { Listener } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

module.exports = class ListenerCooldown extends Listener
{
    constructor()
    {
        super('cooldown', {
            emitter: 'commandHandler',
            event: 'cooldown'
        });
    }

    async exec(message, command, remaining)
    {
        if (command)
        {
            var seconds = remaining / 1000.00;
            var time = parseFloat(seconds).toFixed(2);
            message.say(`Slow down, ${message.author.toString()}! Try again in **${time}** seconds.`, null, this.client.color.no, '⏳').then(sent => {
                setTimeout(() => {
                    sent.delete();
                }, 5000);
            });
            return;
        }
    }

};
