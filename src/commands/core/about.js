/**
 *  ChadMusic - The Chad Music Bot
 *  Copyright (C) 2022  Micky D. | @200percentmicky | Micky-kun#3836
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

const { SlashCommand } = require('slash-create');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');
const prettyms = require('pretty-ms');

// Mainly for version info...
const bot = require('../../../package.json');
const sc = require('../../../node_modules/slash-create/package.json');
const akairo = require('../../../node_modules/discord-akairo/package.json');
const discord = require('../../../node_modules/discord.js/package.json');
const distube = require('../../../chadtube/package.json'); // Temporary

class CommandAbout extends SlashCommand {
    constructor (creator) {
        super(creator, {
            name: 'about',
            description: 'This application is running an instance of ChadMusic, The Chad Music Bot!'
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
            .setDescription('The Chad Music Bot. Also [open-sourced!](https://github.com/200percentmicky/ChadMusic) :thumbsup:')
            .addField('✨ Features', stripIndents`
            :white_small_square: Supports up to 700+ websites.
            :white_small_square: Add multiple filters to the player.
            :white_small_square: Alter filter values during playback.
            :white_small_square: Unlimited volume! :joy::ok_hand:
            :white_small_square: DJ commands to control the player.
            :white_small_square: Queue and track length limits.
            :white_small_square: Advanced queue management.
            :white_small_square: Slash commands ~~when?~~ in development!
            :white_small_square: ???
            :white_small_square: Profit!
            `)
            .addField('⚠ This bot is still a work in progress.', 'This bot is still in an early state. If you come across any issues when using this bot, please notify the developer or make an issue in the [Github repo](https://github.com/200percentmicky/ChadMusic).')
            .addField(`${process.env.EMOJI_INFO} Info`, stripIndents`
            **Client:** ${this.client.user.tag} (\`${this.client.user.id}\`)
            **Bot Version:** ${bot.version}
            **Node.js:** ${process.version}
            **Discord.js:** ${discord.version}
            **slash-create:** ${sc.version}
            **Akairo Framework:** ${akairo.version}
            **DisTube.js:** ${distube.version}
            **Voice Connections:** ${this.client.vc.voices.collection.size}
            **Uptime:** ${prettyms(this.client.uptime, { verbose: true })}
            `, true)
            .setThumbnail('https://cdn.discordapp.com/attachments/375453081631981568/808626634210410506/deejaytreefiddy.png')
            .setFooter({
                text: `The owner of this instance is ${owner}.`,
                iconURL: app.owner?.avatarURL({ dynamic: true })
            });

        const urlGithub = new MessageButton()
            .setStyle('LINK')
            .setURL('https://github.com/200percentmicky/ChadMusic')
            .setLabel('GitHub');

        const support = new MessageButton()
            .setStyle('LINK')
            .setURL('https://discord.com/invite/qQuJ9YQ')
            .setLabel('Support Server');

        const actionRow = new MessageActionRow()
            .addComponents([urlGithub, support]);

        return ctx.send({ embeds: [aboutembed], components: [actionRow], ephemeral: true });
    }
}

module.exports = CommandAbout;
