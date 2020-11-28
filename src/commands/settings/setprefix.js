const { Command } = require('discord-akairo');

module.exports = class CommandSetPrefix extends Command
{
    constructor()
    {
        super('setprefix', {
            aliases: ['setprefix'],
            category: '⚙ Settings',
            description: {
                text: 'Changes the bot\'s prefix for this server.',
                usage: '<prefix>',
                details: '`<prefix>` The new prefix you want to use. If none, resets the prefix to defaults.'
            },
            clientPermissions: ['EMBED_LINKS'],
            userPermissions: ['MANAGE_GUILD']
        });
    }

    async exec(message)
    {
        const args = message.content.split(/ +/g);
        const prefix = args[1];

        if (!args[1])
        {
            this.client.prefix.setPrefix(this.client.config.prefix, message.guild.id);
            return message.ok(`Prefix has been reset to \`${this.client.config.prefix}\``);
        }
        this.client.prefix.setPrefix(prefix, message.guild.id);
        return message.ok(`Prefix has been set to \`${prefix}\``);
    }
};
