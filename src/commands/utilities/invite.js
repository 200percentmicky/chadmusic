const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

module.exports = class CommandInvite extends Command
{
    constructor()
    {
        super('invite', {
            aliases: ['invite'],
            category: '🛠 Utilities',
            description: {
                text: 'Sends a link to invite the bot to a server.'
            },
            clientPermissions: ['EMBED_LINKS']
        });
    }

    async exec(message)
    {
        return message.channel.send(new MessageEmbed()
            .setColor(this.client.color.ok)
            .setAuthor('Links', this.client.user.avatarURL({ dynamic: true }))
            .setDescription(`➔ **[Invite me!](${this.client.config.botinvite})**\n➔ **[Support Server](${this.client.config.invite})**`)
        );
    }
};
