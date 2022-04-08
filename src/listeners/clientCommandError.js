const { Listener } = require('discord-akairo');
const { MessageButton, MessageActionRow } = require('discord.js');

module.exports = class ListenerClientCommandError extends Listener {
    constructor () {
        super('clientCommandError', {
            emitter: 'commandHandler',
            event: 'error'
        });
    }

    async exec (error, message, command) {
        let guru = '💢 **Bruh Moment**\nSomething bad happened. Please report this to the developer.';

        if (message.guild.channels.cache.get(process.env.BUG_CHANNEL)) {
            guru += ' The owner of this application has also received a full error report.\n';
        }

        guru += `\`\`\`js\n${error.name}: ${error.message}\`\`\``;

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

        message.reply({ content: guru, components: [actionRow], allowedMentions: { repliedUser: true } });
        this.client.ui.recordError(this.client, command, '❌ Command Error', error.stack);
        this.client.logger.error('[Client] Error in command "%s": %s', command, error.stack);
    }
};
