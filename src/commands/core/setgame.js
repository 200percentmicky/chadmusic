const { Command } = require('discord-akairo');

module.exports = class CommandSetGame extends Command {
  constructor () {
    super('setgame', {
      aliases: ['setgame'],
      description: {
        text: "Sets the bot's playing status.",
        usage: '[type] <status>',
        details: '`[type]` The type of status to set.\n`<status>` The overall status for the bot to use.'
      },
      category: '💻 Core',
      ownerOnly: true
    });
  }

  async exec (message) {
    const args = message.content.split(/ +/g);

    const statusType = {
      watching: 'WATCHING',
      listening: 'LISTENING',
      streaming: 'STREAMING'
    };

    const setStatus = async (status, type) => {
      try {
        await this.client.user.setActivity(status, { type: type });
        return message.react('✅');
      } catch (err) {
        message.reply({ content: `❌ Unable to set status: \`${err.message}\`` });
      }
    };

    if (statusType[args[1]]) {
      return setStatus(args.slice(2).join(' '), statusType[args[1]]);
    } else {
      return setStatus(args.slice(1).join(' '), 'PLAYING');
    }
  }
};
