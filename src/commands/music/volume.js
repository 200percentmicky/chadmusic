const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

module.exports = class CommandVolume extends Command
{
    constructor()
    {
        super('volume', {
            aliases: ['volume', 'vol'],
            category: '🎶 Player',
            description: {
                text: 'Changes the volume of the player.',
                usage: '<number>',
                details: '`<number>` The percentage of the new volume to set.'
            },
            channel: 'guild',
            clientPermissions: ['EMBED_LINKS']
        });
    }

    async exec(message)
    {
        const args = message.content.split(/ +/g);

        const vc = message.member.voice.channel;
        if (!vc) return message.error('You are not in a voice channel.')

        const queue = this.client.player.getQueue(message.guild.id);
        if (!queue) return message.warn('Nothing is currently playing on this server.');

        const volume = queue.volume;
        if (!args[1]) return message.say('🔊', this.client.color.info, `Current Volume: **${volume}%**`);

        var newVolume = parseInt(args[1]);
        this.client.player.setVolume(message.guild.id, newVolume);

        if (newVolume >= 201) 
        {
            message.channel.send(new MessageEmbed()
                .setColor(this.client.color.warn)
                .setDescription(`${this.client.emoji.warn} Volume has been set to **${newVolume}%**.`)
                .setFooter('Volumes exceeding 200% may cause damage to self and equipment.')
            );
        } else {
            return message.ok(`Volume has been set to **${newVolume}%**.`);
        }
    }
};
