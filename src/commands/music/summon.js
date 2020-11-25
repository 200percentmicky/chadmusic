const { Command } = require('discord-akairo');

module.exports = class CommandSummon extends Command
{
    constructor()
    {
        super('summon', {
            aliases: ['summon', 'join'],
            category: '🎶 Player',
            description: {
                text: 'Joins a ',
                usage: '<url/search>',
                details: '`<url/search>` The URL or search term to load.'
            },
            channel: 'guild',
            clientPermissions: ['EMBED_LINKS']
        });
    }

    async exec(message)
    {
        const vc = message.member.voice.channel;
        if (!vc) return message.error('You are not in a voice channel.')

        const permissions = vc.permissionsFor(this.client.user.id).has(['CONNECT', 'SPEAK']);
        if (!permissions) return message.error(`Missing **Connect** or **Speak** permissions for **${vc.name}**`);

        if (this.client.voice.connections.get(message.guild.id)) return message.warn('I\'m already in a voice channel. Let\'s get this party started!');

        vc.join();
        message.react('📥');
        return message.ok(`Joined **${vc.name}**.`);
    }
};
