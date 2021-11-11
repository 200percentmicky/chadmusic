const { Command } = require('discord-akairo');
const Booru = require('booru');
const { MessageEmbed } = require('discord.js');

module.exports = class CommandRule34 extends Command {
  constructor () {
    super('rule34', {
      aliases: ['rule34', 'r34'],
      category: '🔞 NSFW',
      channel: 'guild',
      description: {
        text: 'Rule 34: If it exists, there\'s porn of it.',
        usage: '<search>'
      },
      clientPermissions: ['EMBED_LINKS', 'ATTACH_FILES'],
      cooldown: 5000
    });
  }

  async exec (message) {
    if (!message.channel.nsfw) return this.client.ui.custom(message, '🔞', process.env.COLOR_NO, 'This command must be used in a NSFW channel.');
    const args = message.content.split(/ +/g);
    let tags = args.slice(1).join('_');

    if (!args[1]) return;

    message.channel.sendTyping();
    const imgs = await Booru.search('rule34', [tags], { limit: 1, random: true });
    if (imgs.length === 0) {
      tags = args.slice(1).join(' ');
      this.client.ui.say(message, 'warn', `No results for \`${tags}\``);
    }

    try {
      imgs.forEach(i => {
        const result = new MessageEmbed()
          .setColor(0x012E57)
          .setTitle(`📜 Score: \`${i.score}\``)
          .setDescription(`**[Click here if the image or video isn't loading.](${i.fileUrl})**`)
          .setImage(i.fileUrl)
          .setTimestamp()
          .setFooter(i.booru.domain);
        message.channel.send({
          embeds: [result],
          files: i.fileUrl.endsWith('.webm' || '.mp4') ? [i.fileUrl] : []
        });
      });
    } catch (err) {
      this.client.ui.say(message, 'error', err.message, 'Booru API Error');
    }
  }
};
