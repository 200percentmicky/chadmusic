const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');
const prettyms = require('pretty-ms');

// Mainly for version info...
const botversion = require('../../../package.json');
const akairoversion = require('../../../node_modules/discord-akairo/package.json');
const discordversion = require('../../../node_modules/discord.js/package.json');
const distubeversion = require('../../../chadtube/package.json'); // Temporary

module.exports = class CommandAbout extends Command {
    constructor () {
        super('about', {
            aliases: ['about'],
            category: '💻 Core',
            description: {
                text: 'Shows information about the bot.'
            }
        });
    }

    async exec (message) {
        const owner = this.client.users.cache.get(this.client.ownerID);
        const aboutembed = new MessageEmbed()
            .setColor(message.guild.me.displayColor !== 0 ? message.guild.me.displayColor : null)
            .setAuthor({
                name: 'About ChadMusic',
                iconURL: this.client.user.avatarURL({ dynamic: true })
            })
            .setDescription('The Chad Music Bot. Also [open-sourced!](https://github.com/200percentmicky/ChadMusic) :thumbsup:')
            .addField('✨ Features', stripIndents`
      :white_small_square: Supports up to 700+ websites.
      :white_small_square: Add multiple filters to the player.
      :white_small_square: Alter filter values during playback.
      :white_small_square: Unlimited volume! :joy::ok_hand:
      :white_small_square: DJ commands to control the player.
      :white_small_square: Queue and track length limits.
      :white_small_square: Advanced queue management.
      :white_small_square: ~~Slash commands when?~~
      :white_small_square: ???
      :white_small_square: Profit!
      `)
            .addField('⚠ This bot is still a work in progress.', 'This bot is still in an early state. If you come across any issues when using this bot, please notify the bot owner or make an issue in the [Github repo](https://github.com/200percentmicky/ChadMusic).')
            .addField(`${process.env.EMOJI_INFO} Info`, stripIndents`
      **Version:** ${botversion.version}
      **Client:** ${this.client.user.tag} (\`${this.client.user.id}\`)
      **Node.js:** ${process.version}
      **Discord.js:** ${discordversion.version}
      **Akairo Framework:** ${akairoversion.version}
      **DisTube.js:** ${distubeversion.version}
      **Voice Connections:** ${this.client.vc.voices.collection.size}
      **Uptime:** ${prettyms(this.client.uptime, { verbose: true })}
      `, true)
            .setThumbnail('https://cdn.discordapp.com/attachments/375453081631981568/808626634210410506/deejaytreefiddy.png')
            .setFooter({
                text: `The owner of this instance is ${owner.tag} (${owner.id}).`,
                iconURL: owner.avatarURL({ dynamic: true })
            });
        return message.reply({ embeds: [aboutembed] });
    }
};
