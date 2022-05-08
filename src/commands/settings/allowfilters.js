const { Command } = require('discord-akairo');

module.exports = class CommandAllowFilters extends Command {
    constructor () {
        super('allowfilters', {
            aliases: ['allowfilters'],
            category: '⚙ Settings',
            description: {
                text: 'Toggles the ability to allow members to apply filters to the player.',
                usage: '<toggle:on/off>',
                details: '`<toggle:on/off>` The toggle of the setting.'
            },
            clientPermissions: ['EMBED_LINKS'],
            userPermissions: ['MANAGE_GUILD']
        });
    }

    async exec (message) {
        const args = message.content.split(/ +/g);
        if (!args[1]) return this.client.ui.usage(message, 'allowfilters <toggle>');
        if (args[1] === 'OFF'.toLowerCase()) {
            await this.client.settings.set(message.guild.id, false, 'allowFilters');
            return this.client.ui.reply(message, 'ok', 'Filters have been disabled. Only DJs will be able to apply filters.');
        } else if (args[1] === 'ON'.toLowerCase()) {
            await this.client.settings.set(message.guild.id, true, 'allowFilters');
            return this.client.ui.reply(message, 'ok', 'Filters have been enabled.');
        } else {
            return this.client.ui.reply(message, 'error', 'Toggles must be **dj** or **all**');
        }
    }
};
