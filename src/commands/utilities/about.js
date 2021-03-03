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
        text: 'Shows information about Poki.'
      }
    })
  }

  async exec (message) {
    const owner = this.client.users.cache.get(this.client.ownerID)
    const aboutembed = new MessageEmbed()
      .setColor(1602089)
      .setAuthor(this.client.user.username + ' - Surf\'s up!', this.client.user.avatarURL({ dynamic: true }))
      .setDescription('Micky-kun\'s multi-purpose Discord bot with a variety of features.')
      .addField('⚠ Caution', 'As with all forms of software that are currently in development, expect for bugs to appear from time to time! Please feel free to contact me using `;contact` if you found a bug when using the bot.')
      .addField(`${this.client.emoji.info} Info`, stripIndents`
      **Node.js:** ${process.version}
      **Bot Version:** ${main.version}
      **Discord.js:** ${discordversion.version}
      **Akairo Framework:** ${akairoversion.version}
      **DisTube.js:** ${distubeversion.version}
      **Uptime:** ${this.client.utils.uptime()}
      `, true)
      .setFooter(`The owner of this instant is ${owner.tag} (${owner.id}).`, owner.avatarURL({ dynamic: true }))
    return message.channel.send(aboutembed)
  }
}
