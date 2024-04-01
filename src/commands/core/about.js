/// ChadMusic - The Chad Music Bot
/// Copyright (C) 2024  Micky | 200percentmicky
///
/// This program is free software: you can redistribute it and/or modify
/// it under the terms of the GNU General Public License as published by
/// the Free Software Foundation, either version 3 of the License, or
/// (at your option) any later version.
///
/// This program is distributed in the hope that it will be useful,
/// but WITHOUT ANY WARRANTY; without even the implied warranty of
/// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
/// GNU General Public License for more details.
///
/// You should have received a copy of the GNU General Public License
/// along with this program.  If not, see <https://www.gnu.org/licenses/>.

const { Command } = require('discord-akairo');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle, Team } = require('discord.js');
const { stripIndents } = require('common-tags');
const prettyms = require('pretty-ms');

// Mainly for version info...
const sc = require('../../../node_modules/slash-create/package.json');
const akairo = require('../../../node_modules/discord-akairo/package.json');
const discord = require('../../../node_modules/discord.js/package.json');
const distube = require('../../../node_modules/distube/package.json'); // Temporary

module.exports = class CommandAbout extends Command {
    constructor () {
        super('about', {
            aliases: ['about'],
            category: '💻 Core',
            description: {
                text: 'Displays information about the bot.'
            }
        });
    }

    async exec (message) {
        const app = this.client.application;

        if (!app.owner) await this.client.application.fetch();

        const owner = app.owner instanceof Team ? `${app.owner?.name}` : `${app.owner?.tag.replace(/#0{1,1}$/, '')} (${app.owner?.id})`;
        const aboutembed = new EmbedBuilder()
            .setColor(message.guild.members.me.displayColor !== 0 ? message.guild.members.me.displayColor : null)
            .setAuthor({
                name: 'ChadMusic - The Chad Music Bot',
                iconURL: this.client.user.avatarURL({ dynamic: true })
            })
            .setDescription('Self-hostable music bot for chaotic social network. ')
            .addFields({
                name: '🎶 Features',
                value: stripIndents`
                :white_small_square: Supports up to 700+ websites.
                :white_small_square: Add multiple filters to the player.
                :white_small_square: Alter filter values during playback.
                :white_small_square: Unlimited volume! :joy::ok_hand:
                :white_small_square: Hide tracks by silently adding them. 🤫
                :white_small_square: DJ commands to control the player.
                :white_small_square: Queue and track length limits.
                :white_small_square: Advanced queue management.
                :white_small_square: Slash commands lol
                :white_small_square: ???
                :white_small_square: Profit!
                `
            }, {
                name: `${process.env.EMOJI_INFO} Stats`,
                value: stripIndents`
                **Client:** ${this.client.user.tag.replace(/#0{1,1}$/, '')} (\`${this.client.user.id}\`)
                **Bot Version:** ${this.client.version}
                **Node.js:** ${process.version}
                **Discord.js:** ${discord.version}
                **slash-create:** ${sc.version}
                **Akairo Framework:** ${akairo.version}
                **DisTube.js:** ${distube.version}
                **Voice Connections:** ${this.client.vc.voices.collection.size}
                **Uptime:** ${prettyms(this.client.uptime, { verbose: true })}
                `,
                inline: true
            })
            .setThumbnail('https://media.discordapp.net/attachments/375453081631981568/808626634210410506/deejaytreefiddy.png')
            .setFooter({
                text: `The owner of this instance is ${owner}`,
                iconURL: app.owner instanceof Team ? app.owner?.iconURL() : app.owner?.avatarURL({ dynamic: true })
            });

        const urlGithub = new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setURL('https://github.com/200percentmicky/chadmusic')
            .setLabel('GitHub');

        const support = new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setURL('https://discord.com/invite/qQuJ9YQ')
            .setLabel('Support Server');

        const docsButton = new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setURL('https://200percentmicky.github.io/chadmusic')
            .setLabel('Documentation');

        const actionRow = new ActionRowBuilder()
            .addComponents([urlGithub, support, docsButton]);

        return message.reply({ embeds: [aboutembed], components: [actionRow] })
            .catch(async () => {
                await message.react(process.env.EMOJI_MUSIC || '🎵');
                return message.member.user.send({ embeds: [aboutembed], components: [actionRow] }).catch(() => {});
            });
    }
};
