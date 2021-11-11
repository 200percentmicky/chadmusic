const { Command } = require('discord-akairo');
const uwu = require('uwufy');

module.exports = class CommandUWU extends Command {
  constructor () {
    super('uwu', {
      aliases: ['uwu'],
      category: '🎳 Fun',
      description: {
        text: uwu('Uwufies a message or a given text.'),
        details: uwu('`[text]` The text to uwufy. If none is provided, uwufies the previous message sent!'),
        usage: uwu('[text]')
      }
    });
  }

  async exec (message) {
    const args = message.content.split(/ +/g);
    let text = args.slice(1).join(' ');

    if (!text) {
      try {
        const lastMsg = await message.channel.messages.fetch({ limit: 2 });
        text = lastMsg.last().content;
        return message.channel.send(uwu(text));
      } catch (err) {
        return this.client.ui.say(message, 'warn', uwu('There is no message for me to uwufy!'));
      }
    }
    return message.channel.send(uwu(text));
  }
};
