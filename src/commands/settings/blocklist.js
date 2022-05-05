const { Command } = require('discord-akairo');

module.exports = class CommandBlocklist extends Command {
    constructor () {
        super('blocklist', {
            aliases: ['blocklist'],
            category: '⚙ Settings',
            description: {
                text: 'Manages the server\'s list of blocked search phrases.',
                usage: '<add/remove> <phrase>',
                details: '`<add/remove>` Subcommands to whether add or remove phrases from the list.\n`<phrase>` The phrase to add or remove from the list.'
            },
            clientPermissions: ['EMBED_LINKS'],
            userPermissions: ['MANAGE_GUILD'],
            args: [
                {
                    id: 'subcommand',
                    type: 'string'
                },
                {
                    id: 'phrase',
                    match: 'rest'
                }
            ]
        });
    }

    async exec (message, args) {
        switch (args.subcommand) {
        case 'add': {
            if (!args.phrase) return this.client.ui.usage(message, 'blocklist <add/remove> <phrase>');
            if (this.client.settings.includes(message.guild.id, args.phrase, 'blockedPhrases')) {
                return this.client.ui.reply(message, 'warn', `\`${args.phrase}\` doesn't exist in the blocklist.`);
            }

            await this.client.settings.push(message.guild.id, args.phrase, 'blockedPhrases');
            this.client.ui.reply(message, 'ok', `\`${args.phrase}\` has been added to the blocklist for this server.`, null, 'Any phrases in the blocklist will no longer be added to the queue.');
            break;
        }

        case 'remove': {
            if (!args.phrase) return this.client.ui.usage(message, 'blocklist <add/remove> <phrase>');
            if (!this.client.settings.includes(message.guild.id, args.phrase, 'blockedPhrases')) {
                return this.client.ui.reply(message, 'warn', `\`${args.phrase}\` doesn't exist in the blocklist.`);
            }

            await this.client.settings.remove(message.guild.id, args.phrase, 'blockedPhrases');
            this.client.ui.reply(message, 'ok', `\`${args.phrase}\` has been removed from the blocklist for this server.`);
            break;
        }

        default: {
            this.client.ui.usage(message, 'blocklist <add/remove> <phrase>');
        }
        }
    }
};
