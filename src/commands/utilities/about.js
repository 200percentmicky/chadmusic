const { Command } = require('discord-akairo')
const { MessageEmbed } = require('discord.js')
const { stripIndents } = require('common-tags')
const { about } = require('../../aliases.json')

// Mainly for version info...
const main = require('../../../package.json')
const akairoversion = require('../../../node_modules/discord-akairo/package.json')
const discordversion = require('../../../node_modules/discord.js/package.json')
const distubeversion = require('../../../node_modules/distube/package.json')

module.exports = class CommandAboutMusic extends Command {
  constructor () {
    super(about !== undefined ? about[0] : 'about', {
      aliases: about || ['about'],
      category: '🛠 Utilities',
      description: {
        text: 'Shows information about ChadMusic.'
      }
    })
  }

  async exec (message) {
    const owner = this.client.users.cache.get(this.client.ownerID)
    const thumbnailUrl = 'https://cdn.discordapp.com/attachments/375453081631981568/808626634210410506/deejaytreefiddy.png'
    const aboutembed = new MessageEmbed()
      .setColor(1602089)
      .setAuthor('ChadMusic - The Chad Music Bot', thumbnailUrl)
      .setDescription('This bot is running an instant of **ChadMusic**, a Discord music bot based on DisTube.js. **ChadMusic** supports over 700+ websites with the ability to add audio filters to the player.')
      .addField(`${this.client.emoji.info} Info`, stripIndents`
      **Client:** ${this.client.user.tag} (ID: ${this.client.user.id})
      **Node.js:** ${process.version}
      **Bot Version:** ${main.version}
      **Discord.js:** ${discordversion.version}
      **Akairo Framework:** ${akairoversion.version}
      **DisTube.js:** ${distubeversion.version}
      **Uptime:** ${this.client.utils.uptime()}
      `, true)
      .setThumbnail(thumbnailUrl)
      .setFooter(`The owner of this instant is ${owner.tag}.`, owner.avatarURL({ dynamic: true }))
    return message.channel.send(aboutembed)
  }
}
