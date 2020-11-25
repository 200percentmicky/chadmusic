const { Listener } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

module.exports = class ListenerPlaySong extends Listener
{
    constructor()
    {
        super('playSong', {
            emitter: 'player',
            event: 'playSong'
        });
    }

    async exec(message, queue, song)
    {
        const textChannel = queue.initMessage.channel; // Because message sometimes returns 'undefined'.
        const channel = queue.connection.channel; // Same.
        const guild = channel.guild; // This as well...
        textChannel.send(new MessageEmbed()
            .setColor(this.client.utils.randColor())
            .setAuthor(`🎵 Now playing in ${guild.name} - ${channel.name}`, guild.iconURL({ dynamic: true }))
            .setTitle(song.name)
            .setURL(song.url)
            .setThumbnail(song.thumbnail)
            .addField('Duration', song.formattedDuration, true)
            .addField('Requested by', song.user, true)
            .setTimestamp()
        );

    }

};
