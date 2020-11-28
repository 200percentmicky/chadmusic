const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

module.exports = class CommandEarrape extends Command
{
    constructor()
    {
        super('earrape', {
            aliases: ['earrape'],
            category: '🎶 Player',
            description: {
                text: 'Changes the volume of the player to 42069%. The ratio that no man can ever withstand.',
                details: 'Only works if Unlimited Volume is On.'
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
            if (!dj) return message.forbidden('DJ Mode is currently active. You must have the DJ Role or the **Manage Channels** permission to use music commands at this time.')
        }

        if (settings.allowFreeVolume == false) return message.forbidden('This command cannot be used because **Unlimited Volume** is currently disabled.');

        // This command should not be limited by the DJ Role. Must be a toggable setting.
        const vc = message.member.voice.channel;
        if (!vc) return message.error('You are not in a voice channel.')

        const queue = this.client.player.getQueue(message.guild.id);
        if (!queue) return message.warn('Nothing is currently playing on this server.');

        var earrape = 42069 // 😂👌👌💯
        const volume = this.client.player.getQueue(message).volume;
        if (volume >= 5000)
        {
            this.client.player.setVolume(message, 100);
            return message.ok('Volume has been set to **100%** 😌😏')
        } else {
            this.client.player.setVolume(message, earrape);
            return message.channel.send(new MessageEmbed()
                .setColor(this.client.color.ok)
                .setDescription(`🔊💢💀 Volume has been set to **${earrape}%**. 😂👌👌`)
                .setFooter('Volumes exceeding 200% may cause damage to self and equipment.')
            );
        }
    }
};
