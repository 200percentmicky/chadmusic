const { Command } = require('discord-akairo');

module.exports = class CommandDemonic extends Command
{
    constructor()
    {
        super('demonic', {
            aliases: ['demonic'],
            category: '🗣 Filter',
            description: {
                text: 'Adds a demonic sounding filter to the player.',
                filter: 'vibrato=f=2500:d=1'
            },
            channel: 'guild',
            clientPermissions: ['EMBED_LINKS']
        });
    }

    async exec(message)
    {
        const vc = message.member.voice.channel;
        if (!vc) return message.error('You are not in a voice channel.')

        const queue = this.client.player.getQueue(message.guild.id);
        if (!queue) return message.warn('Nothing is currently playing on this server.');

        await this.client.player.setFilter(message.guild.id, 'demonic');
        return message.ok(`Applied filter: **Demonic**`);
    }
}
