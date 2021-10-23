const { Command } = require('discord-akairo');

module.exports = class CommandPrefix extends Command {
  constructor () {
    super('musicprefix', {
      aliases: ['musicprefix'],
      category: '⚙ Settings',
      description: {
        text: 'Changes the bot\'s prefix for music commands in this server.',
        usage: '<prefix>',
        details: '`<prefix>` The new prefix you want to use. If none, resets the prefix to defaults.'
      },
      clientPermissions: ['EMBED_LINKS'],
      userPermissions: ['MANAGE_GUILD']
    });
  }

  async exec (message) {
    const args = message.content.split(/ +/g);
    const prefix = args[1];

    if (!args[1]) {
      await this.client.settings.delete(message.guild.id, 'prefix');
      return this.client.ui.reply(message, 'ok', `The prefix has been reset to \`${process.env.PREFIX}\``);
    }
    await this.client.settings.set(message.guild.id, 'prefix', prefix);
    return this.client.ui.reply(message, 'ok', `The prefix has been set to \`${prefix}\``);
  }
};
