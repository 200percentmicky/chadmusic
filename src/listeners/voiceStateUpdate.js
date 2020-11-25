const { Listener } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

module.exports = class ListenerVoiceStateUpdate extends Listener
{
    constructor()
    {
        super('voiceStateUpdate', {
            emitter: 'client',
            event: 'voiceStateUpdate'
        });
    }

    async exec(oldState, newState)
    {
        const settings = this.client.settings.get(newState.guild.id);
        if (!settings) return;
        // var timestamp = `\`[${this.client.moment(new Date()).format('YYYY-MM-DD HH:mm:ss')}]\``;
        const voiceLogChannel = this.client.channels.cache.find(val => val.id == settings.voiceStateUpdate);
        if (!voiceLogChannel) return;

        if (!oldState.channel)
        {
            return voiceLogChannel.send(new MessageEmbed()
                .setColor(0x78B159)
                .setAuthor(newState.member.user.tag + ' - ' + newState.member.user.id, newState.member.user.avatarURL({ dynamic: true }))
                .setDescription(`**Joined:** ${newState.channel.name}`)
                .setTimestamp()
                .setFooter('Joined Voice Channel', 'https://cdn.discordapp.com/attachments/375453081631981568/704912947972931635/large-green-circle_1f7e2.png')
            );
        }

        if (!newState.channel)
        {
            let embed = new MessageEmbed()
                .setColor(0xDD2E44)
                .setAuthor(newState.member.user.tag + ' - ' + newState.member.user.id, newState.member.user.avatarURL({ dynamic: true }))
                .setDescription(`**Left:** ${oldState.channel.name}`)
                .setTimestamp()
                .setFooter('Left Voice Channel', 'https://cdn.discordapp.com/attachments/375453081631981568/704913269747351602/large-red-circle_1f534.png')
            
            /*
            await newState.guild.fetchAuditLogs({ type: 'MEMBER_DISCONNECT' }).then(audit => {
                const x = audit.entries.first();
                if (newState.member.user.toString() == x.executor.toString()) return;
                else if (audit) embed.addField('Moderator', x.executor.toString(), true);
            });
            */
            return voiceLogChannel.send(embed);
        }

        if (oldState.channel !== newState.channel)
        {
            let embed = new MessageEmbed()
                .setColor(0x55ACEE)
                .setAuthor(newState.member.user.tag + ' - ' + newState.member.user.id, newState.member.user.avatarURL({ dynamic: true }))
                .setDescription(`${oldState.channel.name} 🡆 ${newState.channel.name}`)
                .setTimestamp()
                .setFooter('Moved Voice Channels', 'https://cdn.discordapp.com/attachments/375453081631981568/704913168660430892/large-blue-circle_1f535.png');
            /*
            await newState.guild.fetchAuditLogs({ type: 'MEMBER_MOVE' }).then(audit => {
                const x = audit.entries.first();
                if (newState.member.user.toString() == x.executor.toString()) return;
                else if (audit) embed.addField('Moderator', x.executor.toString(), true);
            });
            */
            return voiceLogChannel.send(embed);
        }
    }

};
