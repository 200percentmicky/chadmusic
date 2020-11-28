const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

module.exports = class CommandSkip extends Command
{
    constructor()
    {
        super('skip', {
            aliases: ['skip', 's'],
            category: '🎶 Player',
            description: {
                text: 'Skips the currently playing song.'
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
        if (!this.client.player.isPlaying(message) || !currentVc) return message.warn('Nothing is currently playing in this server.');
        else if (vc.id !== currentVc.channel.id) return message.error('You must be in the same voice channel that I\'m in to use that command.');

        var votes = [];
        votes.push(message.author.id);
        const neededVotes = votes.length >= Math.round(currentVc.channel.members.size / 2);
        const requiredVotes = Math.round(currentVc.channel.members.size / 2) - votes.length;

        if (args[1] === '--force' || args[1] === '-f')
        {
            votes = [];
            this.client.player.skip(message);
            return message.say('⏭', this.client.color.info, 'Skipped!');
            
        }
        if (!neededVotes)
        {
            return message.channel.send(new MessageEmbed()
                .setColor(this.client.color.info)
                .setDescription('⏭ Skipping?')
                .setFooter(`${requiredVotes} more vote${requiredVotes === 1 ? 's' : ''} needed to skip. Yo DJ, you can force skip by using the --force flag.`)
            );
        } else {
            votes = [];
            this.client.player.skip(message);
            return message.say('⏭', this.client.color.info, 'Skipped!');
        }
    }
};
