const { Command } = require('discord-akairo')
const { MessageEmbed } = require('discord.js')
const { stripIndents } = require('common-tags')
// Mainly for version info...
const main = require('../../../package.json')
const akairoversion = require('../../../node_modules/discord-akairo/package.json')
const discordversion = require('../../../node_modules/discord.js/package.json')
const distubeversion = require('../../../node_modules/distube/package.json')

module.exports = class CommandAbout extends Command {
  constructor () {
    super('about', {
      aliases: ['about'],
      category: '🛠 Utilities',
      description: {
        text: 'Information about Deejay.'
      }
    })
  }

  async exec (message) {
    const owner = this.client.users.cache.get(this.client.ownerID)
    const thumbnailUrl = 'https://media.discordapp.net/attachments/375453081631981568/618705968934551592/pokitaru_bot_2019-1-22.png?width=773&height=761'
    const aboutembed = new MessageEmbed()
      .setColor(this.client.color.blood)
      .setAuthor('PokiMusic', this.client.user.avatarURL({ dynamic: true }))
      .setDescription('A feature rich Music Bot for Pokitaru. Supports 700+ websites and filters!')
      .addField(`${this.client.emoji.info} Info`, stripIndents`
      **Bot Version:** \`${main.version}\`
      **Node.js** \`${process.version}\`
      **Discord.js:** \`${discordversion.version}\`
      **Akairo:** \`${akairoversion.version}\`
      **DisTube:** \`${distubeversion.version}\`
      `, true)
      .setThumbnail(thumbnailUrl)
      /*
      .addField('🔗 Links', stripIndents`
      **[Support Server](${this.client.config.invite})**
      **[Invite me!](${this.client.config.botinvite})**
      **[Fork me on Github!](http://github.com/mickykuna/deejay)**
      `, true)
      */
      .setFooter(`Created by ${owner.tag}.`, owner.avatarURL({ dynamic: true }))
    return message.channel.send(aboutembed)
  }
}
