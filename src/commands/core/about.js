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
      .setDescription('Project Wave is my attempted rewrite of a multi-purpose Discord bot. It extends off of ChadMusic with additional commands and features with the goal to replace whats currently running on Poki.')
      .addField('⚠ Caution', `This bot is a work in progress. Anything you see in this build is not guaranteed to persist into the next. As with all forms of software currently in development, there will be bugs! If you come across any, please feel free to report any bugs to the **[support server](${process.env.SERVER_INVITE})**.`)
      .addField(`${process.env.EMOJI_INFO} Info`, stripIndents`
      **Client:** ${this.client.user.tag} (\`${this.client.user.id}\`)
      **Node.js:** ${process.version}
      **Bot Version:** ${main.version}
      **Discord.js:** ${discordversion.version}
      **Akairo Framework:** ${akairoversion.version}
      **DisTube.js:** ${distubeversion.version}
      **Uptime:** ${this.client.utils.uptime()}
      `, true)
      .setThumbnail(this.client.user.avatarURL({ dynamic: true }))
      .setFooter(`Created by ${owner.tag} (${owner.id}).`, owner.avatarURL({ dynamic: true }))
    return message.channel.send({ embeds: [aboutembed] })
  }
}
