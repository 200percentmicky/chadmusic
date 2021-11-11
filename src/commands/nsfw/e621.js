const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const Booru = require('booru');

module.exports = class CommandE621 extends Command {
  constructor () {
    super('e621', {
      aliases: ['e621', 'furry'],
      channel: 'guild',
      category: '🔞 NSFW',
      description: {
        text: 'e621 - Furry Porn',
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

    const imgs = await Booru.search('e621', [tags], { limit: 1, random: true });
    if (imgs.length === 0) {
      tags = args.slice(1).join(' ');
      this.client.ui.reply(message, 'warn', `No results for \`${tags}\``);
    }

    try {
      imgs.forEach(i => {
        const result = new MessageEmbed()
          .setColor(0x012E57)
          .setTitle(`😺 Score: \`${i.score}\``)
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
      this.client.ui.reply(message, 'error', err.message, '`Booru API Error.`');
    }
  }
};
