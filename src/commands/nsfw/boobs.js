const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const reddit = require('reddit-image-fetcher');

module.exports = class CommandBoobs extends Command {
  constructor () {
    super('boobs', {
      aliases: ['boobs', 'boobies', 'tiddies'],
      channel: 'guild',
      category: '🔞 NSFW',
      description: {
        text: 'Get a random boob pic!'
      },
      clientPermissions: ['EMBED_LINKS', 'ATTACH_FILES'],
      cooldown: 10000
    });
  }

  async exec (message) {
    if (!message.channel.nsfw) return this.client.ui.custom(message, '🔞', process.env.COLOR_NO, 'This command must be used in a NSFW channel.');

    message.channel.sendTyping();
    try {
      const tiddyPic = await reddit.fetch({
        type: 'custom',
        total: '1',
        subreddit: ['boobs', 'Titties']
      });
      const embed = new MessageEmbed()
        .setColor(this.client.utils.randColor())
        .setAuthor({
          name: `${tiddyPic[0].title}`,
          iconURL: message.author.avatarURL({ dynamic: true }),
          url: tiddyPic[0].postLink
        })
        .setDescription(`**[Click here if the image isn't loading.](${tiddyPic[0].image})**`)
        .setImage(tiddyPic[0].image)
        .setTimestamp()
        .setFooter({
          text: `r/${tiddyPic[0].subreddit}`
        });
      message.channel.send({ embeds: [embed] });
    } catch (err) {
      this.client.ui.reply(message, 'error', err.message, 'Reddit API Error');
    }
  }
};
