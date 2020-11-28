const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

module.exports = class CommandDJMode extends Command
{
    constructor()
    {
        super('djmode', {
            aliases: ['djmode'],
            category: '⚙ Settings',
            description: {
                text: 'Toggles DJ Mode for the server.',
                deatils: 'Requires the DJ role or the **Manage Channels** permission.'
            },
            clientPermissions: ['EMBED_LINKS']
        });
    }

    async exec(message)
    {
        const dj = message.member.roles.cache.has(this.client.settings.get(message.guild.id).djRole) || message.member.hasPermission(['MANAGE_CHANNELS'])
        if (!dj) return message.forbidden(`You must have the DJ role or the **Manage Channels** permissions to toggle DJ Mode.`);
        const djMode = this.client.settings.get(message.guild.id, 'djMode')
        const toggle = djMode == true ? false : true;
        
        await this.client.settings.set(message.guild.id, toggle, 'djMode');
        return message.ok(`DJ Mode has been **${djMode == true ? 'disabled' : 'enabled'}**.`);
    }
};