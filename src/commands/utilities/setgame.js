const { stripIndent } = require('common-tags');
const { Command } = require('discord-akairo');

module.exports = class CommandSetGame extends Command
{
    constructor()
    {
        super('setgame', {
            aliases: ['setgame'],
            category: '🛠 Utilities',
            description: {
                text: 'Changes the bot\'s playing status.',
                usage: '|--clear|--reset| <type> <status>',
                details: stripIndent`
                \n\`|--clear/--reset|\`
                \`--clear/-c\` Clears the bot's playing status.
                \`--reset/-r\` Resets the bot's playing status to defaults.

                \`<type>\` The type of status to use. Either playing, watching, or listening.
                \`<status>\` Your bot's new playing status.
                `
            },
            ownerOnly: true
        });
    }

    async exec(message)
    {
        const args = message.content.split(/ +/g);
        if (args[1] == 'clear')
        {
            await this.client.user.setActivity();
            return message.ok('Playing status has been cleared.');
        }

        if (args[1] == 'reset')
        {
            await this.client.user.setActivity(`${this.client.config.prefix}help`, { type: 'PLAYING' });
            return message.ok('Playing status has been reverted to defaults.');
        }

        const type = [
            'playing',
            'watching',
            'listening'
        ];
        const status = `${this.client.config.prefix}help | ${type.includes(args[1]) ? args.slice(2).join(' ') : args.slice(1).join(' ')}`;
        const _type = type.includes(args[1]) ? args[1] : null
        await this.client.user.setActivity(status, { type: _type ? _type.toUpperCase() : null });
        return message.react(this.client.emoji.okReact);
    }
};
