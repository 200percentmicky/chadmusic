const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

module.exports = class CommandRestart extends Command {
    constructor () {
        super('restart', {
            aliases: ['restart', 'jsrestart'],
            ownerOnly: true,
            category: '💻 Core',
            description: {
                text: 'Attempts to restart the bot.',
                usage: '[reason]',
                details: '`[reason]` The reason for restarting the bot.'
            }
        });
    }

    async exec (message) {
        const args = message.content.split(/ +/g);
        let restartReport = args.slice(1).join(' ');
        if (!restartReport) restartReport = 'Just refreshing... nothing serious. :3';
        const errChannel = this.client.channels.cache.find(val => val.id === process.env.BUG_CHANNEL);
        await message.channel.send('🔄 Restarting...');
        const embed = new MessageEmbed()
            .setColor(process.env.COLOR_INFO)
            .setTitle('🔄 Restart')
            .setDescription(`\`\`\`js\n${restartReport}\`\`\``)
            .setTimestamp();
        await errChannel.send({ embeds: [embed] });
        this.client.logger.info('[Restart] %s', restartReport);
        this.client.logger.warn('Shutting down...');
        this.client.destroy();
        process.exit(0);
    }
};
