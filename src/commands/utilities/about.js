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
    super('aboutmusic', {
      aliases: ['aboutmusic'],
      category: '🛠 Utilities',
      description: {
        text: 'Shows information about ChadMusic.'
      }
    })
  }

  async exec (message) {
    const owner = this.client.users.cache.get(this.client.ownerID)
    const aboutembed = new MessageEmbed()
      .setColor(1602089)
      .setAuthor('About PokiMusic', this.client.user.avatarURL({ dynamic: true }))
      .setDescription('A Music Bot for Poki based on a forked build of **[DisTube.js](https://distube.js.org)**.')
      .addField('✨ Features', stripIndents`
      ▫ Supports 700+ websites.
      ▫ Add filters to the player.
      ▫ Alter filter values during playback.
      ▫ Unlimited volume! 😂👌
      ▫ DJ commands to control the player.
      ▫ Queue and track length limits.
      ▫ And more to come!
      `)
      .addField('⚠ Caution', 'As with all forms of software that are currently in development, expect for bugs to appear from time to time! Please feel free to contact me using `;contact` if you found a bug when using the bot.')
      .addField(`${this.client.emoji.info} Info`, stripIndents`
      **Client:** ${this.client.user.tag}
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
