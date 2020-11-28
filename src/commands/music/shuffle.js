const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

module.exports = class CommandShuffle extends Command
{
    constructor()
    {
        super('shuffle', {
            aliases: ['shuffle'],
            category: '🎶 Player',
            description: {
                text: 'Randomizes the entries in the queue.'
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
        if (!vc) return message.error('You are not in a voice channel.');

        const currentVc = this.client.voice.connections.get(message.guild.id);
        if (currentVc.channel.members.size <= 2 || dj)
        {
            if (vc.id !== currentVc.channel.id) return message.error('You must be in the same voice channel that I\'m in to use that command.');

            const permissions = vc.permissionsFor(this.client.user.id).has(['CONNECT', 'SPEAK']);
            if (!permissions) return message.error(`Missing **Connect** or **Speak** permissions for **${vc.name}**`);

            const queue = this.client.player.getQueue(message);
            if (!queue) return message.warn('Nothing is currently playing in this server.');
            this.client.player.shuffle(message);
            return message.ok(`**${queue.songs.length}** entries have been shuffled.`);
        } else {
            return message.error('You must have the DJ role on this server, or the **Manage Channel** permission to use that command. Being alone with me works too!');
        }
    }
};
