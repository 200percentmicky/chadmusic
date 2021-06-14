const { stripIndents } = require('common-tags')
const { Listener } = require('discord-akairo')
const { MessageEmbed } = require('discord.js')

module.exports = class ListenerVoiceStateUpdate extends Listener {
  constructor () {
    super('voiceStateUpdate', {
      emitter: 'client',
      event: 'voiceStateUpdate'
    })
  }

  async exec (oldState, newState) {
    const settings = this.client.settings.get(newState.guild.id, 'voiceStateUpdate')
    if (!settings) return
    // var timestamp = `\`[${this.client.moment(new Date()).format('YYYY-MM-DD HH:mm:ss')}]\``;
    const voiceLogChannel = this.client.channels.cache.find(val => val.id === settings)
    if (!voiceLogChannel) return

    if (!oldState.channel) {
      const embedJoin = new MessageEmbed()
        .setColor(0x78B159)
        .setAuthor(`${newState.member.user.tag}`, newState.member.user.avatarURL({ dynamic: true }))
        .setTitle('🟢 Joined Voice Channel')
        .setDescription(`<#${newState.channel.id}>`)
        .addField('ID', stripIndents`
        \`\`\`js
        Voice Channel: ${newState.channel.id}
        User: ${newState.member.user.id}
        \`\`\`
        `)
        .setTimestamp()
      return voiceLogChannel.send({ embed: embedJoin })
    }

    if (!newState.channel) {
      const embedLeave = new MessageEmbed()
        .setColor(0xDD2E44)
        .setAuthor(`${newState.member.user.tag}`, newState.member.user.avatarURL({ dynamic: true }))
        .setTitle('🔴 Left Voice Channel')
        .setDescription(`<#${oldState.channel.id}>`)
        .addField('ID', stripIndents`
        \`\`\`js
        Voice Channel: ${oldState.channel.id}
        User: ${oldState.member.user.id}
        \`\`\`
        `)
        .setTimestamp()

      /*
            await newState.guild.fetchAuditLogs({ type: 'MEMBER_DISCONNECT' }).then(audit => {
                const x = audit.entries.first();
                if (newState.member.user.toString() == x.executor.toString()) return;
                else if (audit) embed.addField('Moderator', x.executor.toString(), true);
            });
            */
      return voiceLogChannel.send({ embed: embedLeave })
    }

    if (oldState.channel !== newState.channel) {
      const embedMoved = new MessageEmbed()
        .setColor(0x55ACEE)
        .setAuthor(`${newState.member.user.tag}`, newState.member.user.avatarURL({ dynamic: true }))
        .setTitle('🔵 Moved Voice Channels')
        .setDescription(`<#${oldState.channel.id}> 🡆 <#${newState.channel.id}>`)
        .addField('ID', stripIndents`
        \`\`\`js
        New Voice Channel: ${newState.channel.id}
        Old Voice Channel: ${oldState.channel.id}
        User: ${newState.member.user.id}
        \`\`\`
        `)
        .setTimestamp()
      /*
            await newState.guild.fetchAuditLogs({ type: 'MEMBER_MOVE' }).then(audit => {
                const x = audit.entries.first();
                if (newState.member.user.toString() == x.executor.toString()) return;
                else if (audit) embed.addField('Moderator', x.executor.toString(), true);
            });
            */
      return voiceLogChannel.send({ embed: embedMoved })
    }
  }
}
