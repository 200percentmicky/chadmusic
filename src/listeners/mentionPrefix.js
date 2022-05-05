const { Listener } = require('discord-akairo');

module.exports = class ListenerMentionPrefix extends Listener {
    constructor () {
        super('mentionPrefix', {
            emitter: 'client',
            event: 'messageCreate'
        });
    }

    async exec (message) {
        if (message.content === `<@${this.client.user.id}>`) {
            return message.channel.send(`${process.env.EMOJI_MUSIC} My prefix for music commands is \`${process.env.PREFIX}\`. You can also use the applications's Slash Commands, or use the bot's mention as a prefix.`);
        }
    }
};
