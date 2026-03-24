/// ChadMusic
/// Copyright (C) 2026  Micky | 200percentmicky
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
        const owner = this.client.owner instanceof Team ? `${this.client.owner?.name}` : `${this.client.owner?.tag.replace(/#0{1,1}$/, '')} (${this.client.owner?.id})`;
        const aboutembed = new EmbedBuilder()
            .setColor(message.guild.members.me.displayColor !== 0 ? message.guild.members.me.displayColor : null)
            .setAuthor({
                name: 'ChadMusic',
                iconURL: 'https://media.discordapp.net/attachments/375453081631981568/808626634210410506/deejaytreefiddy.png'
            })
            .setDescription('giga chad audio playing robot for a chaos social network ')
            .addFields({
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
            .setThumbnail('https://cdn.discordapp.com/attachments/738075742646042673/1486117844151439633/chad_cat_headphones.png?ex=69c45698&is=69c30518&hm=b5835cb9145e58f30b8e6ac77f1278efabf137554691a130fbce96c8a6a4a9be&')
            .setFooter({
                text: `The owner of this instance is ${owner}`,
                iconURL: this.client.owner instanceof Team ? this.client.owner?.iconURL() : this.client.owner?.avatarURL({ dynamic: true })
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
