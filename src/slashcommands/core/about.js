const { SlashCommand } = require('slash-create');
const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');
const prettyms = require('pretty-ms');

// Mainly for version info...
const akairoversion = require('../../../node_modules/discord-akairo/package.json');
const discordversion = require('../../../node_modules/discord.js/package.json');
const distubeversion = require('../../../chadtube/package.json'); // Temporary

class CommandAbout extends SlashCommand {
  constructor (creator) {
    super(creator, {
      name: 'about',
      description: 'Information about this bot.'
    });

    this.filePath = __filename;
  }

  async run (ctx) {
    const guild = this.creator.client.guilds.cache.get(ctx.guildID);
    const owner = this.creator.client.users.cache.get(this.creator.client.ownerID);
    const aboutembed = new MessageEmbed()
      .setColor(guild.me.displayColor !== 0 ? guild.me.displayColor : null)
      .setAuthor({
        name: 'Project Wave',
        iconURL: this.client.user.avatarURL({ dynamic: true })
      })
      .setDescription('Cool ~~open-source~~ Discord bot. :thumbsup:')
      /*
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
      */
      .addField('⚠ This bot is still a work in progress.', 'This bot is still in an early state. If you come across any issues when using this bot, please notify the bot owner.')
      .addField(`${process.env.EMOJI_INFO} Info`, stripIndents`
      **Client:** ${this.client.user.tag} (\`${this.client.user.id}\`)
      **Node.js:** ${process.version}
      **Discord.js:** ${discordversion.version}
      **Akairo Framework:** ${akairoversion.version}
      **DisTube.js:** ${distubeversion.version}
      **Voice Connections:** ${this.client.vc.voices.collection.size}
      **Uptime:** ${prettyms(this.client.uptime, { verbose: true })}
      `, true)
      .setThumbnail(this.client.user.avatarURL({ dynamic: true }))
      .setFooter({
        text: `The owner of this instance is ${owner.tag} (${owner.id}).`,
        iconURL: owner.avatarURL({ dynamic: true })
      });
    return ctx.send({ embeds: [aboutembed], ephemeral: true });
  }
}

module.exports = CommandAbout;
