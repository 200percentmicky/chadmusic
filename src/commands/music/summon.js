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
        const settings = this.client.settings.get(message.guild.id);
        const dj = message.member.roles.cache.has(settings.djRole) || message.member.hasPermission(['MANAGE_CHANNELS'])
        if (settings.djMode)
        {
            if (!dj) return message.forbidden('DJ Mode is currently active. You must have the DJ Role or the **Manage Channels** permission to use music commands at this time.', 'DJ Mode')
        }

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
