const { Command } = require('discord-akairo');
const { setqueuelimit } = require('../../aliases.json');

module.exports = class CommandSetQueueLimit extends Command {
  constructor () {
    super(setqueuelimit !== undefined ? setqueuelimit[0] : 'setqueuelimit', {
      aliases: setqueuelimit || ['setqueuelimit'],
      category: '⚙ Settings',
      description: {
        text: 'Limits the number of entries that members can add to the queue.',
        usage: '<number|0/none>',
        details: '`<number|0/none>` The numbers of entries to limit for members.\n- DJs can bypass this limitation.'
      },
      clientPermissions: ['EMBED_LINKS'],
      userPermissions: ['MANAGE_GUILD']
    });
  }

  async exec (message) {
    const args = message.content.split(/ +/g);

    if (!args[1]) return this.client.ui.usage(message, 'setqueuelimit <number|0/none>');

    if (args[1] === (0 || 'NONE'.toLowerCase())) {
      await this.client.settings.remove(message.guild.id, 'maxQueueLimit');
      return this.client.ui.reply(message, 'ok', 'Queue Limits have been removed.');
    }

    if (isNaN(args[1])) return this.client.ui.reply(message, 'error', 'You must provide a number.');
    else if (args[1] < 0) return this.client.ui.reply(message, 'error', 'You cannot use a negative value.');

    await this.client.settings.set(message.guild.id, 'maxQueueLimit', parseInt(args[1]));
    return this.client.ui.reply(message, 'ok', `Queue Limits have been set to \`${args[1]}\``);
  }
};
