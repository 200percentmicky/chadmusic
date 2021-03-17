const { oneLine, stripIndents } = require('common-tags')
const { Command } = require('discord-akairo')

module.exports = class CommandTremolo extends Command {
  constructor () {
    super('tremolo', {
      aliases: ['tremolo'],
      category: '📢 Filter',
      description: {
        text: 'Adds a tremolo filter to the player.',
        usage: '<depth:int(0.1-1)/off> <frequency:int>',
        details: stripIndents`
        \`<depth:int(0.1-1)/off>\` The depth of the tremolo between 0.1-1, or "off" to disable it.
        \`<frequency:int>\` The frequency of the tremolo.
        `
      },
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS']
    })
  }

  async exec (message) {
    const args = message.content.split(/ +/g)
    const djMode = this.client.djMode.get(message.guild.id)
    const djRole = this.client.djRole.get(message.guild.id)
    const dj = message.member.roles.cache.has(djRole) ||
      message.channel.permissionsFor(message.member.user.id).has(['MANAGE_CHANNELS'])

    if (djMode) {
      if (!dj) {
        return message.say('no', oneLine`
          DJ Mode is currently active. You must have the DJ Role or the **Manage Channels** 
          permission to use music commands at this time.
        `)
      }
    }

    const vc = message.member.voice.channel
    if (!vc) return message.say('error', 'You are not in a voice channel.')

    const queue = this.client.player.getQueue(message.guild.id)
    if (!queue) return message.say('warn', 'Nothing is currently playing on this server.')

    const currentVc = this.client.voice.connections.get(message.guild.id)
    if (currentVc) {
      if (args[1] === 'OFF'.toLowerCase()) {
        await this.client.player.setFilter(message.guild.id, 'tremolo', 'off')
        return message.custom('📢', this.client.color.info, '**Tremolo** Off')
      } else {
        const d = args[1]
        let f = parseInt(args[2])
        if (d < 0.1 || d > 1 || isNaN(d)) {
          return message.say('error', 'Depth must be between **0.1** to **1**, or **off**.')
        }
        if (!args[2]) f = 5
        if (isNaN(f)) {
          return message.say('error', 'Frequency requires a number.')
        }
        if (f < 1) {
          return message.say('error', 'Frequency must be greater than 0.')
        }
        await this.client.player.setFilter(message.guild.id, 'tremolo', `tremolo=f=${f}:d=${d}`)
        return message.custom('📢', this.client.color.info, `**Tremolo** Depth \`${d}\` at \`${f}Hz\``)
      }
    } else {
      if (vc.id !== currentVc.channel.id) {
        return message.say('error', oneLine`
          You must be in the same voice channel that I\'m in to use that command.
        `)
      }
    }
  }
}
