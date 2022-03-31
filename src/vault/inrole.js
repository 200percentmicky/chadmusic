const { Command } = require('discord-akairo');
const { Paginator } = require('array-paginator');
const { MessageEmbed } = require('discord.js');

module.exports = class CommandInRole extends Command {
    constructor () {
        super('inrole', {
            aliases: ['inrole'],
            category: '🔧 Tools',
            description: {
                text: 'Returns a list of all members within a role.',
                usage: '<role>',
                details: '`<role>` The role you want to view a list for. Can be a mention, the name of the role, or a role ID.'
            },
            channel: 'guild',
            clientPermissions: ['EMBED_LINKS']
        });
    }

    async exec (message) {
        const args = message.content.split(/ +/g);
        const role = message.mentions.roles.first() ||
      message.guild.roles.cache.get(args[1]) ||
      message.guild.roles.cache.find(val => val.name === args.slice(1).join(' '));
        if (!role) return message.say('error', `\`${args.slice(1).join(' ')}\` is not a valid role on this server.`);

        // A list of all members in an array
        const memberList = role.members.array();

        // Paginator utilizing the array
        const paginator = new Paginator(memberList, 10);

        // Page 1 of the Paginator
        const paginatorArray = paginator.page(1);

        // The map of the first page
        const roleMap = memberList.length > 0
            ? paginatorArray.map(x => x)
            : 'Nothing to show here...';

        const embed = new MessageEmbed()
            .setColor(role.color)
            .setAuthor(`${role.name}`)
            .setTitle(`${memberList.length} member${memberList === 1 ? ' has' : 's have'} this role.`)
            .setDescription(roleMap);

        if (memberList.length > 0) {
            embed.setFooter(`Page ${paginator.current} of ${paginator.total}`);
        }

        // Previous Page
        const previousPage = new MessageButton()
            .setStyle('PRIMARY')
            .setEmoji(process.env.PREVIOUS_PAGE)
            .setCustomId('previous_page')
            .setDisabled(true); // Since the embed opens on the first page.

        // Next Page
        const nextPage = new MessageButton()
            .setStyle('PRIMARY')
            .setEmoji(process.env.NEXT_PAGE)
            .setCustomId('next_page');

        // Cancel
        const cancelButton = new MessageButton()
            .setStyle('DANGER')
            .setEmoji(process.env.CLOSE)
            .setCustomId('cancel_button');
    }
};
