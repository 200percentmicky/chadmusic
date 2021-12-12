const { Command } = require('discord-akairo');
const Roll = require('roll');

module.exports = class RollCommand extends Command {
  constructor () {
    super('roll', {
      aliases: ['roll'],
      description: {
        text: 'Rolls a dice expression.'
      },
      category: '💻 Core'
    });
  }

  async exec (message) {
    const args = message.content.split(/ +/g);
    const roll = new Roll();
    const diceSyntax = args.slice(1).join('');

    if (!roll.validate(diceSyntax)) {
      return this.client.ui.reply(message, 'error', `\`${diceSyntax}\` is not a valid dice expression.`);
    }

    const diceRoll = roll.roll(diceSyntax);
    let nice;
    if (diceSyntax === '69d420') { // nice
      message.react('👌');
      nice = 'Nice 👍';
    }
    return this.client.ui.custom(message, '🎲', message.guild.me.displayColor, `${diceRoll.input}: (${diceRoll.rolled.join(', ')}) = \`${diceRoll.result}\``, `${diceRoll.result}`, nice);
  }
};
