const { Command } = require('discord-akairo')
const { MessageEmbed } = require('discord.js')
const { stripIndents } = require('common-tags')

// Mainly for version info...
const main = require('../../../package.json')
const akairoversion = require('../../../node_modules/discord-akairo/package.json')
const discordversion = require('../../../node_modules/discord.js/package.json')
const distubeversion = require('../../../node_modules/distube/package.json')

module.exports = class CommandAboutMusic extends Command {
  constructor () {
    super('about', {
      aliases: ['about'],
      category: '🛠 Utilities',
      description: {
        text: 'Shows information about the bot.'
      }
    })
  }

  async exec (message) {
    const owner = this.client.users.cache.get(this.client.ownerID)
    const thumbnailUrl = this.client.user.avatarURL({ dynamic: true })
    const aboutembed = new MessageEmbed()
      .setColor(this.client.color.blood)
      .setAuthor(this.client.user.name + ' - The Chad Music Bot', thumbnailUrl)
      .setDescription('A Discord Music bot based off of DisTube.js that supports 700+ websites, audio filters, unlimited volume, etc.')
      .addField(`${this.client.emoji.info} Info`, stripIndents`
      **Bot Version:** \`${main.version}\`
      **Node.js** \`${process.version}\`
      **Discord.js:** \`${discordversion.version}\`
      **Akairo:** \`${akairoversion.version}\`
      **DisTube:** \`${distubeversion.version}\`
      `, true)
      .setThumbnail(thumbnailUrl)
      .setFooter(`Created by ${owner.tag}.`, owner.avatarURL({ dynamic: true }))
    return message.channel.send(aboutembed)
  }
}
