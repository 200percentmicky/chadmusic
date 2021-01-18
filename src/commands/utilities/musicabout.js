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
    super('musicabout', {
      aliases: ['musicabout'],
      category: '🛠 Utilities',
      description: {
        text: 'Information about Deejay.'
      }
    })
  }

  async exec (message) {
    const owner = this.client.users.cache.get(this.client.ownerID)
    const thumbnailUrl = this.client.user.avatarURL({ dynamic: true })
    const aboutembed = new MessageEmbed()
      .setColor(this.client.color.ok)
      .setAuthor('ChadMusic', thumbnailUrl)
      .setDescription('This bot is running a instance of **ChadMusic**, a Discord Music Bot based off of DisTube.js.')
      .addField('✨ Features', stripIndents`
      - Play sources from any site that YouTube-DL supports. YouTube, Soundcloud, Twitch, etc.
      - Unlimited Volume! The sky is the limit!
      - Apply filters to the player, with more being added in the future!
      - Control how the bot can be used. Max Queue Limitation, Song Duration Limits, plus more to come!
      `)
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
