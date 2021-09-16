const { Command } = require('discord-akairo')
const { MessageEmbed } = require('discord.js')
const { stripIndents } = require('common-tags')
const prettyms = require('pretty-ms')

// Mainly for version info...
const akairoversion = require('../../../node_modules/discord-akairo/package.json')
const discordversion = require('../../../node_modules/discord.js/package.json')
const distubeversion = require('../../../chadtube/package.json') // Temporary

module.exports = class CommandAbout extends Command {
  constructor () {
    super('about', {
      aliases: ['about'],
      category: '💻 Core',
      description: {
        text: 'Shows information about the bot.'
      }
    })
  }

  async exec (message) {
    const owner = this.client.users.cache.get(this.client.ownerID)
    const aboutembed = new MessageEmbed()
      .setColor(message.guild.me.displayColor)
      .setAuthor('ChadMusic - The Chad Music Bot', this.client.user.avatarURL({ dynamic: true }))
      .setDescription('A badass music bot for your badass Discord server.')
      .addField('✨ Features', stripIndents`
      :white_small_square: Supports up to 700+ websites.
      :white_small_square: Add multiple filters to the player.
      :white_small_square: Alter filter values during playback.
      :white_small_square: Unlimited volume! :joy::ok_hand:
      :white_small_square: DJ commands to control the player.
      :white_small_square: Queue and track length limits.
      :white_small_square: Advanced queue management.
      :white_small_square: ???
      :white_small_square: Profit, bitches!
      `)
      .addField('⚠ This bot is still a work in progress.', `As with all forms of software currently in development, there will be 🐛 **bugs!** If you come across any, please feel free to report any bugs to the **[support server](${process.env.SERVER_INVITE})**.`)
      .addField(`${process.env.EMOJI_INFO} Info`, stripIndents`
      **Client:** ${this.client.user.tag} (\`${this.client.user.id}\`)
      **Node.js:** ${process.version}
      **Discord.js:** ${discordversion.version}
      **Akairo Framework:** ${akairoversion.version}
      **DisTube.js:** ${distubeversion.version}
      **Uptime:** ${prettyms(this.client.uptime, { verbose: true })}
      `, true)
      .setThumbnail(this.client.user.avatarURL({ dynamic: true }))
      .setFooter(`The owner of this instance is ${owner.tag} (${owner.id}).`, owner.avatarURL({ dynamic: true }))
    return message.channel.send({ embeds: [aboutembed] })
  }
}
