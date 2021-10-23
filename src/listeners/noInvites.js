const { Listener } = require('discord-akairo');

module.exports = class ListenerNoInvites extends Listener {
  constructor () {
    super('noInvites', {
      emitter: 'client',
      event: 'messageCreate'
    });
  }

  async exec (message) {
    const noinvite = this.client.settings.get(message.guild.id, 'noInvites');
    if (message.member.permissions.FLAGS.MANAGE_MESSAGES) return;

    if (noinvite) {
      const msg = message.content.split(/ +/g);
      const pattern = /(http(s)?:\/\/)?(discord(app)?(\.com\/(invite)?|\.gg))\/[a-zA-Z0-9].{0,60}/gmi;
      const regex = new Array(pattern);
      for (let i = 0; i < regex.length; i++) {
        const match = regex[i].exec(msg);
        if (match) {
          message.delete();
          message.channel.send(`${message.member.user.toString()}, ${process.env.EMOJI_ERROR} Please do not post invite links.`);
        }
      }
    }
  }
};
