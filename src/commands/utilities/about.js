const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');
// Mainly for version info...
const main = require('../../../package.json');
const akairoversion = require('../../../node_modules/discord-akairo/package.json');
const discordversion = require('../../../node_modules/discord.js/package.json');
const distubeversion = require('../../../node_modules/distube/package.json');

module.exports = class CommandAbout extends Command
{
    constructor()
    {
        super('about', {
            aliases: ['about'],
            category: '⚙ Utilities',
            description: {
                text: 'Information about Deejay.'
            }
        });
    }

    async exec(message)
    {
        const owner = this.client.users.cache.get(this.client.ownerID);
        const aboutembed = new MessageEmbed()
            .setColor(0x187229)
            .setAuthor('Deejay - The Chad Music Bot!', this.client.user.avatarURL({ dynamic: true }))
            .setDescription(`A music bot that supports over 700+ websites and has filters!`)
            .addField(`${this.client.emoji.info} Info`, stripIndents`
            **Bot Version:** \`${main.version}\`
            **Discord.js:** \`${discordversion.version}\`
            **Akairo:** \`${akairoversion.version}\`
            **DisTube:** \`${distubeversion.version}\`
            `, true)
            .setThumbnail('https://media.discordapp.net/attachments/375453081631981568/618705968934551592/pokitaru_bot_2019-1-22.png?width=568&height=560')
            .addField('🔗 Links', stripIndents`
            **[Support Server](${this.client.config.invite})**
            **[Invite me!](${this.client.config.botinvite})**
            **[Fork me on Github!](http://github.com/mickykuna/deejay)**
            `)
            .setFooter(`Created by ${owner.tag}.`, owner.avatarURL({ dynamic: true }));
        return message.channel.send(aboutembed);
    }
};
