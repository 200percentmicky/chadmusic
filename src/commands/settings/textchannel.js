const { Command } = require('discord-akairo');

module.exports = class CommandTextChannel extends Command {
    constructor () {
        super('textchannel', {
            aliases: ['textchannel'],
            category: '⚙ Settings',
            description: {
                text: 'Sets the text channel to use for music commands.',
                usage: '<text_channel>',
                details: "`<text_channel>` The text channel to apply. Can be the channel's mention or the channel's ID."
            },
            userPermissions: ['MANAGE_GUILD']
        });
    }

    async exec (message) {
        const args = message.content.split(/ +/g);
        if (args[1]) {
            const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]);
            if (!channel) {
                return this.client.ui.reply(message, 'error', `\`${args[1]}\` is not a valid text channel.`);
            } else {
                await this.client.settings.set(message.guild.id, 'textChannel', channel.id);
                return this.client.ui.reply(message, 'ok', `<#${channel.id}> will be used for music commands.`);
            }
        } else {
            await this.client.settings.delete(message.guild.id, 'textChannel');
            return this.client.ui.reply(message, 'ok', 'All text channels will be used for music commands.');
        }
    }
};
