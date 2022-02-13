const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const reddit = require('reddit-image-fetcher');

module.exports = class CommandCleanLewds extends Command {
  constructor () {
    super('cleanlewds', {
      aliases: ['cleanlewds'],
      channel: 'guild',
      category: '🔞 NSFW',
      description: {
        text: 'Socially acceptable anime girls, but it\'s still NSFW.'
      },
      clientPermissions: ['EMBED_LINKS', 'ATTACH_FILES'],
      cooldown: 10000
    });
  }

  async exec (message) {
    if (!message.channel.nsfw) return this.client.ui.send(message, 'NSFW_ONLY');

    message.channel.sendTyping();
    try {
      const wholesomePic = await reddit.fetch({
        type: 'custom',
        total: '1',
        subreddit: ['WholesomeLewds']
      });
      const embed = new MessageEmbed()
        .setColor(this.client.utils.randColor())
        .setAuthor({
          name: `${wholesomePic[0].title}`,
          iconURL: message.author.avatarURL({ dynamic: true }),
          url: wholesomePic[0].postLink
        })
        .setDescription(`**[Click here if the image isn't loading.](${wholesomePic[0].image})**`)
        .setImage(wholesomePic[0].image)
        .setTimestamp()
        .setFooter({
          text: `r/${wholesomePic[0].subreddit}`
        });
      message.channel.send({ embeds: [embed] });
    } catch (err) {
      this.client.ui.reply(message, 'error', err.message, 'Reddit API Error');
    }
  }
};
