const { SlashCommand } = require('slash-create');
const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');
const prettyms = require('pretty-ms');

// Mainly for version info...
const bot = require('../../../package.json');
const scversion = require('../../../node_modules/slash-create/package.json');
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
        const guild = this.client.guilds.cache.get(ctx.guildID);
        const app = await this.client.application.fetch();
        const owner = `${app.owner?.tag ?? app.owner?.name} (${app.owner?.id})`;
        const aboutembed = new MessageEmbed()
            .setColor(guild.me.displayColor !== 0 ? guild.me.displayColor : null)
            .setAuthor({
                name: 'About ChadMusic',
                iconURL: this.client.user.avatarURL({ dynamic: true })
            })
            .setDescription('The Chad Music Bot. Also [open source](https://github.com/200percentmicky/ChadMusic)!')
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
            .addField('⚠ This bot is still a work in progress.', 'This bot is still in an early state. If you come across any issues when using this bot, please notify the bot owner.')
            .addField(`${process.env.EMOJI_INFO} Info`, stripIndents`
            **Client:** ${this.client.user.tag} (\`${this.client.user.id}\`)
            **Bot Version:** ${bot.version}
            **Node.js:** ${process.version}
            **Discord.js:** ${discordversion.version}
            **slash-create:** ${scversion.version}
            **DisTube.js:** ${distubeversion.version}
            **Voice Connections:** ${this.client.vc.voices.collection.size}
            **Uptime:** ${prettyms(this.client.uptime, { verbose: true })}
            `, true)
            .setThumbnail('https://cdn.discordapp.com/attachments/375453081631981568/808626634210410506/deejaytreefiddy.png')
            .setFooter({
                text: `The owner of this instance is ${owner}.`,
                iconURL: app.owner?.avatarURL({ dynamic: true })
            });
        return ctx.send({ embeds: [aboutembed], ephemeral: true });
    }
}

module.exports = CommandAbout;
