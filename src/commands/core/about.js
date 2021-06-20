const { Command } = require('discord-akairo')
const { MessageEmbed } = require('discord.js')
const { stripIndents } = require('common-tags')

// Mainly for version info...
const akairoversion = require('../../../node_modules/discord-akairo/package.json')
const discordversion = require('../../../node_modules/discord.js/package.json')
const distubeversion = require('../../../node_modules/distube/package.json')

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
      .setAuthor('Project Wave', this.client.user.avatarURL({ dynamic: true }))
      .setDescription(`${this.client.user.username}'s powerful music player based on **[DisTube](https://distube.js.org)**. Type \`;info\` for my main build.`)
      .addField('✨ Features', stripIndents`
      :white_small_square: Supports 700+ websites.
      :white_small_square: Add filters to the player.
      :white_small_square: Alter filter values during playback.
      :white_small_square: Unlimited volume! :joy::ok_hand:
      :white_small_square: DJ commands to control the player.
      :white_small_square: Queue and track length limits.
      :white_small_square: And more to come!
      `)
      .addField('⚠ Caution', `This bot is a work in progress. As with all forms of software currently in development, there will be bugs! If you come across any, please feel free to report any bugs to the **[support server](${process.env.SERVER_INVITE})**.`)
      .addField(`${process.env.EMOJI_INFO} Info`, stripIndents`
      **Client:** ${this.client.user.tag} (\`${this.client.user.id}\`)
      **Node.js:** ${process.version}
      **Discord.js:** ${discordversion.version}
      **Akairo Framework:** ${akairoversion.version}
      **DisTube.js:** ${distubeversion.version}
      **Uptime:** ${this.client.utils.uptime()}
      `, true)
      .setThumbnail(this.client.user.avatarURL({ dynamic: true }))
      .setFooter(`Created by ${owner.tag} (${owner.id}).`, owner.avatarURL({ dynamic: true }))
    return message.channel.send({ embed: aboutembed })
  }
}
