const { Command } = require('discord-akairo');

module.exports = class CommandMusicPrefix extends Command {
    constructor () {
        super('prefix', {
            aliases: ['prefix'],
            category: '⚙ Settings',
            description: {
                text: 'Changes the bot\'s prefix for this server.',
                usage: '<prefix>',
                details: '`<prefix>` The new prefix you want to use. If none, resets the prefix to defaults.'
            },
            clientPermissions: ['EMBED_LINKS'],
            userPermissions: ['MANAGE_GUILD'],
            args: [
                {
                    id: 'prefix',
                    type: 'string'
                }
            ]
        });
    }

    async exec (message, args) {
        const prefix = args.prefix;

        if (!prefix) {
            await this.client.settings.set(message.guild.id, process.env.PREFIX, 'prefix');
            return this.client.ui.reply(message, 'ok', `The prefix has been reset to \`${process.env.PREFIX}\``);
        }
        await this.client.settings.set(message.guild.id, prefix, 'prefix');
        return this.client.ui.reply(message, 'ok', `The prefix has been set to \`${prefix}\``);
    }
};
