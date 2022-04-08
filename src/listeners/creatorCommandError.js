const { Listener } = require('discord-akairo');
const { MessageButton, MessageActionRow } = require('discord.js');

module.exports = class ListenerCreatorCommandError extends Listener {
    constructor () {
        super('creatorCommandError', {
            emitter: 'creator',
            event: 'commandError'
        });
    }

    async exec (command, err, ctx) {
        await ctx.defer({ ephemeral: true });
        let guru = '💢 **Bruh Moment**\nSomething bad happened. Please report this to the developer.';

        const guild = this.client.guilds.cache.get(ctx.guildID);
        if (guild.channels.cache.get(process.env.BUG_CHANNEL)) {
            guru += ' The owner of this application has also received a full error report.\n';
        }

        guru += `\`\`\`js\n${err.name}: ${err.message}\`\`\``;

        const urlGithub = new MessageButton()
            .setStyle('LINK')
            .setURL('https://github.com/200percentmicky/ChadMusic')
            .setLabel('GitHub Repo');

        const support = new MessageButton()
            .setStyle('LINK')
            .setURL('https://discord.com/invite/qQuJ9YQ')
            .setLabel('Support Server');

        const actionRow = new MessageActionRow()
            .addComponents([urlGithub, support]);

        await ctx.send(guru, {
            components: [actionRow]
        });
        this.client.ui.recordError(this.client, command.commandName, '❌ Command Error', err.stack);
        this.client.logger.error('[SlashCreator] Error in command "%s": %s', command.commandName, err.stack);
    }
};
