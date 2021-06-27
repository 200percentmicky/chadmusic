const { Command } = require('discord-akairo')
const { MessageEmbed } = require('discord.js')
const reddit = require('reddit-image-fetcher')

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
    })
  }

  async exec (message) {
    if (!message.channel.nsfw) return message.custom('🔞', this.client.color.no, 'This command must be used in a NSFW channel.')

    message.channel.startTyping()
    try {
      const wholesomePic = await reddit.fetch({
        type: 'custom',
        total: '1',
        subreddit: ['WholesomeLewds']
      })
      const embed = new MessageEmbed()
        .setColor(this.client.utils.randColor())
        .setAuthor(`${wholesomePic[0].title}`, message.author.avatarURL({ dynamic: true }), wholesomePic[0].postLink)
        .setDescription(`**[Click here if the image isn't loading.](${wholesomePic[0].image})**`)
        .setImage(wholesomePic[0].image)
        .setTimestamp()
        .setFooter(`r/${wholesomePic[0].subreddit}`)
      message.channel.send({ embed: embed })
    } catch (err) {
      message.say('error', err.message, 'Reddit API Error')
      return message.channel.stopTyping(true)
    }
    return message.channel.stopTyping()
  }
}