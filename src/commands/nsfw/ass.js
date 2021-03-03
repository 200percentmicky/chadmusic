const { Command } = require('discord-akairo')
const { MessageEmbed } = require('discord.js')
const reddit = require('reddit-image-fetcher')

module.exports = class CommandAss extends Command {
  constructor () {
    super('ass', {
      aliases: ['ass', 'booty'],
      channel: 'guild',
      category: '🔞 NSFW',
      description: {
        text: 'Get a random booty pic!'
      },
      clientPermissions: ['EMBED_LINKS', 'ATTACH_FILES'],
      cooldown: 10000,
      nsfw: true
    })
  }

  async exec (message) {
    if (!message.channel.nsfw) return message.custom('🔞', this.client.color.no, 'This command must be used in a NSFW channel.')

    message.channel.startTyping()
    try {
      const boodyPic = await reddit.fetch({
        type: 'custom',
        total: '1',
        subreddit: ['ass']
      })
      message.channel.send(new MessageEmbed()
        .setColor(this.client.utils.randColor())
        .setAuthor(boodyPic[0].title, message.author.avatarURL({ dynamic: true }), boodyPic[0].postLink)
        .setDescription(`**[Click here if the image isn't loading.](${boodyPic[0].image})**`)
        .setImage(boodyPic[0].image)
        .setTimestamp()
        .setFooter(`r/${boodyPic[0].subreddit}`)
      )
    } catch (err) {
      message.say('error', err.message, 'Reddit API Error')
      return message.channel.stopTyping(true)
    }
    return message.channel.stopTyping()
  }
}
