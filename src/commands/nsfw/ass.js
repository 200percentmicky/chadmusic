const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const reddit = require('reddit-image-fetcher');

module.exports = class CommandAss extends Command {
  constructor () {
    super('ass', {
      aliases: ['ass', 'booty', 'butt'],
      channel: 'guild',
      category: '🔞 NSFW',
      description: {
        text: 'Get a random booty pic!'
      },
      clientPermissions: ['EMBED_LINKS', 'ATTACH_FILES'],
      cooldown: 10000
    });
  }

  async exec (message) {
    if (!message.channel.nsfw) return this.client.ui.send(message, 'NSFW_ONLY');

    message.channel.sendTyping();
    try {
      const boodyPic = await reddit.fetch({
        type: 'custom',
        total: '1',
        subreddit: ['ass']
      });
      const embed = new MessageEmbed()
        .setColor(this.client.utils.randColor())
        .setAuthor({
          name: `${boodyPic[0].title}`,
          iconURL: message.author.avatarURL({ dynamic: true }),
          url: boodyPic[0].postLink
        })
        .setDescription(`**[Click here if the image isn't loading.](${boodyPic[0].image})**`)
        .setImage(boodyPic[0].image)
        .setTimestamp()
        .setFooter({
          text: `r/${boodyPic[0].subreddit}`
        });
      message.channel.send({ embeds: [embed] });
    } catch (err) {
      this.client.ui.say(message.channel, 'error', err.message, 'Reddit API Error');
    }
  }
};
