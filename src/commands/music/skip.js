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
        const vc = message.member.voice.channel;
        if (!vc) return message.error('You are not in a voice channel.');

        const currentVc = this.client.voice.connections.get(message.guild.id);
        if (!this.client.player.isPlaying(message) || !currentVc) return message.warn('Nothing is currently playing in this server.');
        else if (vc.id !== currentVc.channel.id) return message.error('You must be in the same voice channel that I\'m in to use that command.');

        var votes = [];
        votes.push(message.author.id);
        const neededVotes = votes.length === currentVc.channel.members.size / 2;
        const requiredVotes = currentVc.channel.members.size / 2 - votes.length;
        if (!neededVotes)
        {
            return message.channel.send(new MessageEmbed()
                .setColor(this.client.color.info)
                .setDescription('⏭ Skipping?')
                .setFooter(`${requiredVotes} more vote${requiredVotes === 1 ? 's' : ''} needed to skip.`)
            );
        } else {
            votes = [];
            this.client.player.skip(message);
            return message.say('⏭', this.client.color.info, 'Skipped!');
        }
    }
};
