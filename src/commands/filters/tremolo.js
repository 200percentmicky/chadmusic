const { oneLine, stripIndents } = require('common-tags')
const { Command } = require('discord-akairo')

module.exports = class CommandTremolo extends Command {
  constructor () {
    super('tremolo', {
      aliases: ['tremolo'],
      category: '📢 Filter',
      description: {
        text: 'Adds a tremolo filter to the player.',
        usage: '<depth:int(0.1-1)/off> [frequency:int]',
        details: stripIndents`
        \`<depth:int(0.1-1)/off>\` The depth of the tremolo between 0.1-1, or "off" to disable it.
        \`[frequency:int]\` The frequency of the tremolo.
        `
      },
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS']
    })
  }

  async exec (message) {
    const args = message.content.split(/ +/g)
    const djMode = this.client.settings.get(message.guild.id, 'djMode')
    const djRole = this.client.settings.get(message.guild.id, 'djRole')
    const allowFilters = this.client.settings.get(message.guild.id, 'allowFilters')
    const dj = message.member.roles.cache.has(djRole) ||
      message.channel.permissionsFor(message.member.user.id).has(['MANAGE_CHANNELS'])

    if (djMode) {
      if (!dj) {
        return this.client.ui.say(message, 'no', oneLine`
          DJ Mode is currently active. You must have the DJ Role or the **Manage Channels** 
          permission to use music commands at this time.
        `)
      }
    }

    if (allowFilters === 'dj') {
      if (!dj) {
        return this.client.ui.say(message, 'no', 'You must have the DJ Role or the **Manage Channels** permission to use filters.')
      }
    }

    const vc = message.member.voice.channel
    if (!vc) return this.client.ui.reply(message, 'error', 'You are not in a voice channel.')

    const queue = this.client.player.getQueue(message.guild.id)
    if (!queue) return this.client.ui.say(message, 'warn', 'Nothing is currently playing on this server.')

    const currentVc = this.client.vc.get(vc)
    if (currentVc) {
      if (args[1] === 'OFF'.toLowerCase()) {
        try {
          await this.client.player.setFilter(message.guild.id, 'tremolo', false)
          return this.client.ui.custom(message, '📢', process.env.COLOR_INFO, '**Tremolo** Off')
        } catch (err) {
          return this.client.ui.reply(message, 'error', '**Tremolo** is not applied to the player.')
        }
      } else {
        if (!args[1]) {
          return this.client.ui.usage(message, 'tremolo <depth:int(0.1-1)/off> [frequency:int]')
        }
        const d = parseInt(args[1])
        let f = parseInt(args[2])
        if (d < 0.1 || d > 1 || isNaN(d)) {
          return this.client.ui.reply(message, 'error', 'Depth must be between **0.1** to **1**, or **off**.')
        }
        if (!args[2]) f = 5
        if (isNaN(f)) {
          return this.client.ui.reply(message, 'error', 'Frequency requires a number.')
        }
        if (f < 1) {
          return this.client.ui.reply(message, 'error', 'Frequency must be greater than 0.')
        }
        await this.client.player.setFilter(message.guild.id, 'tremolo', `tremolo=f=${f}:d=${d}`)
        return this.client.ui.custom(message, '📢', process.env.COLOR_INFO, `**Tremolo** Depth \`${d}\` at \`${f}Hz\``)
      }
    } else {
      if (vc.id !== currentVc.channel.id) {
        return this.client.ui.reply(message, 'error', oneLine`
          You must be in the same voice channel that I\'m in to use that command.
        `)
      }
    }
  }
}
