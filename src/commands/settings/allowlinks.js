const { Command } = require('discord-akairo');

module.exports = class CommandAllowLinks extends Command {
    constructor () {
        super('allowlinks', {
            aliases: ['allowlinks'],
            category: '⚙ Settings',
            description: {
                text: 'Toggles the ability to add songs to the queue from a URL.',
                usage: '<toggle:on/off>',
                details: '`<toggle:on/off>` The toggle of the setting.'
            },
            userPermissions: ['MANAGE_GUILD']
        });
    }

    async exec (message) {
        const args = message.content.split(/ +/g);
        if (!args[1]) return this.client.ui.usage(message, 'allowlinks <toggle:on/off>');

        const settings = this.client.settings;
        switch (args[1]) {
        case 'on': {
            await settings.set(message.guild.id, true, 'allowLinks');
            this.client.ui.reply(message, 'ok', 'URLs can now be added to the queue.');
            break;
        }
        case 'off': {
            await settings.set(message.guild.id, false, 'allowLinks');
            this.client.ui.reply(message, 'ok', 'URLs can no longer be added to the queue.');
            break;
        }
        default: {
            this.client.ui.reply(message, 'error', 'Toggle must be **on** or **off**.');
            break;
        }
        }
    }
};
