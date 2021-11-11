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
    if (!message.channel.nsfw) return this.client.ui.custom(message, '🔞', process.env.COLOR_NO, 'This command must be used in a NSFW channel.');

    message.channel.sendTyping();
    try {
      const boodyPic = await reddit.fetch({
        type: 'custom',
        total: '1',
        subreddit: ['ass']
      });
      const embed = new MessageEmbed()
        .setColor(this.client.utils.randColor())
        .setAuthor(`${boodyPic[0].title}`, message.author.avatarURL({ dynamic: true }), boodyPic[0].postLink)
        .setDescription(`**[Click here if the image isn't loading.](${boodyPic[0].image})**`)
        .setImage(boodyPic[0].image)
        .setTimestamp()
        .setFooter(`r/${boodyPic[0].subreddit}`);
      message.channel.send({ embeds: [embed] });
    } catch (err) {
      this.client.ui.say(message.channel, 'error', err.message, 'Reddit API Error');
    }
  }
};
