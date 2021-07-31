const { Command } = require('discord-akairo')
const { MessageEmbed } = require('discord.js')
const { stripIndents } = require('common-tags')
const prettyms = require('pretty-ms')

// Mainly for version info...
const akairoversion = require('../../../node_modules/discord-akairo/package.json')
const discordversion = require('../../../node_modules/discord.js/package.json')
const distubeversion = require('../../../node_modules/distube/package.json') // Temporary

module.exports = class CommandAbout extends Command {
  constructor () {
    super('musicabout', {
      aliases: ['musicabout'],
      category: '💻 Core',
      description: {
        text: 'Shows information about the bot.'
      }
    })
  }

  async exec (message) {
    const owner = this.client.users.cache.get(this.client.ownerID)
    const aboutembed = new MessageEmbed()
      .setColor(process.env.COLOR_BLOOD)
      .setAuthor(`About ${this.client.user.username}`, this.client.user.avatarURL({ dynamic: true }))
      .setDescription('A powerful badass music bot for your bad ass Discord server!')
      .addField('✨ Features', stripIndents`
      ▫ Supports up to 700+ websites.
      ▫ Add multiple filters to the player.
      ▫ Alter filter values during playback.
      ▫ Unlimited volume! 😂👌
      ▫ DJ commands to control the player.
      ▫ Queue and track length limits.
      ▫ Advanced queue management.
      ▫ ???
      ▫ Profit, bitches!
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
      .setFooter(`Created by ${owner.tag} (${owner.id}).`, owner.avatarURL({ dynamic: true }))
    return message.channel.send({ embeds: [aboutembed] })
  }
}
