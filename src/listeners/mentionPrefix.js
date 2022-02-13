const { Listener } = require('discord-akairo');
const { Permissions } = require('discord.js');

module.exports = class ListenerMentionPrefix extends Listener {
  constructor () {
    super('mentionPrefix', {
      emitter: 'client',
      event: 'messageCreate'
    });
  }

  async exec (message) {
    const prefix = this.client.settings.get(message.guild.id, 'prefix', process.env.PREFIX);
    let canChange;
    if (message.channel.permissionsFor(message.member.user.id).has(Permissions.FLAGS.MANAGE_GUILD)) {
      canChange = ` | You can run \`${prefix}musicprefix\` to change this.`;
    }
    if (message.content === `<@!${this.client.user.id}>`) {
      return message.channel.send(`${process.env.EMOJI_MUSIC} My prefix for music commands in **${message.guild.name}** is \`${prefix}\`.${canChange}`);
    }
  }
};
