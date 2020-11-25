const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');
// Mainly for version info...
const main = require('../../../package.json');
const akairoversion = require('../../../node_modules/discord-akairo/package.json');
const discordversion = require('../../../node_modules/discord.js/package.json');

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
            .setTitle(this.client.emoji.cutie + 'About Pokitaru')
            .setDescription(`Just your usual multi-purpose Discord Bot with a variety of commands. Still a work in progress! 💚`)
            .addField(`${this.client.emoji.info} Info`, stripIndents`
            **Bot Version:** \`${main.version}\`
            **Discord.js:** \`${discordversion.version}\`
            **Akairo:** \`${akairoversion.version}\`
            `, true)
            .setThumbnail('https://media.discordapp.net/attachments/375453081631981568/618705968934551592/pokitaru_bot_2019-1-22.png?width=568&height=560')
            .addField('🔗 Links', stripIndents`
            **[Support Server](${this.client.config.invite})**
            **[Invite me!](${this.client.config.botinvite})**
            **[Fork me on Github!](http://github.com/mickykuna/Pokitaru)**
            `)
            .addField('\u200b', '*Even though the sun beams its deadly rays down on us with unbearable heat, it provides us the very essence of life itself, the energy we need to enjoy our time at the beach. Just one of mother nature\'s gifts. The moon however is much more peaceful. Where the sun provides energy and heat, the moon makes waves perfect for surfing that will surely make a girl\'s heart race with excitement as she begins to ride the waves into the sunset.*')
            .setFooter(`Created by ${owner.tag}. Licensed under MIT. Read the LICENSE for more info.`, owner.avatarURL({ dynamic: true }));
        return message.channel.send(aboutembed);
    }
};
