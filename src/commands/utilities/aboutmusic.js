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
        text: 'Shows information about Poki.'
      }
    })
  }

  async exec (message) {
    const owner = this.client.users.cache.get(this.client.ownerID)
    const aboutembed = new MessageEmbed()
      .setColor(1602089)
      .setAuthor('ChadMusic - The Chad Music Bot', this.client.user.avatarURL({ dynamic: true }))
      .setDescription('A feature-rich open source music bot based on a forked build of **[DisTube.js](https://distube.js.org/)**.')
      .addField('✨ Features', stripIndents`
      :white_small_square: Supports 700+ websites.
      :white_small_square: Add filters to the player.
      :white_small_square: Alter filter values during playback.
      :white_small_square: Unlimited volume! :joy::ok_hand:
      :white_small_square: DJ commands to control the player.
      :white_small_square: Queue and track length limits.
      :white_small_square: And more to come!
      `)
      .addField('⚠ Caution', 'As with all forms of software that\'s currently in development, there will be bugs! Please report any bugs you may come across by opening an issue on **[GitHub](https://github.com/mickykuna/ChadMusic)**.')
      .addField(`${process.env.EMOJI_INFO} Info`, stripIndents`
      **Client:** ${this.client.user.tag} (\`${this.client.user.id}\`)
      **Node.js:** ${process.version}
      **Bot Version:** ${main.version}
      **Discord.js:** ${discordversion.version}
      **Akairo Framework:** ${akairoversion.version}
      **DisTube.js:** ${distubeversion.version}
      **Uptime:** ${this.client.utils.uptime()}
      `, true)
      .setThumbnail('https://media.discordapp.net/attachments/375453081631981568/808626634210410506/deejaytreefiddy.png')
      .setFooter(`The owner of this instant is ${owner.tag} (${owner.id}).`, owner.avatarURL({ dynamic: true }))
    return message.channel.send(aboutembed)
  }
}
