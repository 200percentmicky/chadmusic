const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const { FieldsEmbed } = require('discord-paginationembed');

module.exports = class CommandQueue extends Command
{
    constructor()
    {
        super('queue', {
            aliases: ['queue', 'q'],
            category: '🎶 Player',
            description: {
                text: 'View the queue for this server.'
            },
            channel: 'guild',
            clientPermissions: ['EMBED_LINKS']
        });
    }

    async exec(message)
    {
        const queue = this.client.player.getQueue(message);
        const vc = message.member.voice.channel;
        const currentVc = this.client.voice.connections.get(message.guild.id);

        if (!this.client.player.isPlaying(message) || !currentVc) return message.warn('Nothing is currently playing in this server.');
        else if (vc.id !== currentVc.channel.id) return message.error('You must be in the same voice channel that I\'m in to use that command.');

        const songs = queue.songs;
        const queueEmbed = new FieldsEmbed()
            .setArray(songs)
            .setAuthorizedUsers(message.author.id)
            .setChannel(message.channel)
            .setElementsPerPage(7)
            .setPageIndicator('footer')
            .formatField(`${songs.length} entries in the queue.`, song => song ? `${songs.indexOf(song) + 1}: [${song.name}](${song.url}) \`${song.formattedDuration}\` ${song.user}` : `${this.client.emoji.warn}Queue is empty.`)
            .setPage(1)
            .setNavigationEmojis({
                back: '◀',
                jump: '↗',
                forward: '▶',
                delete: '❌'
            });
        
        queueEmbed.embed
            .setColor(this.client.utils.randColor())
            .setAuthor(`Queue for ${message.guild.name} - ${currentVc.channel.name}`, message.guild.iconURL({ dynamic: true }))
            .setDescription(`${this.client.emoji.music}**Currently Playing:**\n**[${songs[0].name}](${songs[0].url})**`)
            .setFooter('\u200b'); // Ironically required if .setPageIndicator() is using 'footer'.

        queueEmbed.build();
    }
};
