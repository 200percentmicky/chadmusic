const { stripIndent } = require('common-tags')
const { Command } = require('discord-akairo')
const { filter } = require('../../aliases.json')

module.exports = class CommandFilter extends Command {
  constructor () {
    super(filter !== undefined ? filter[0] : 'filter', {
      aliases: filter || ['filter'],
      description: {
        text: 'Applies a filter to the player.',
        details: stripIndent`
        \`<filter>\` The filter to apply to the player. Only one filter can be used at a time.
        **Available Filters:** 3d, vaporwave, bassboost, demonic, earwax, echo, flanger, gate, haas, karaoke, nightcore, phaser, reverse, vibrato, off
        `,
        usage: '<filter>'
      },
      category: '🎶 Player'
    })
  }

  async exec (message) {
    const settings = this.client.settings.get(message.guild.id)
    const dj = message.member.roles.cache.has(settings.djRole) || message.member.hasPermission(['MANAGE_CHANNELS'])
    if (settings.djMode) {
      if (!dj) {
        return message.say('no', 'DJ Mode is currently active. You must have the DJ Role or the **Manage Channels** permission to use music commands at this time.')
      }
    }

    const vc = message.member.voice.channel
    if (!vc) {
      return message.say('error', 'You are not in a voice channel.')
    }

    const queue = this.client.player.getQueue(message.guild.id)
    if (!queue) {
      return message.say('warn', 'Nothing is currently playing on this server.')
    }

    const currentVc = this.client.voice.connections.get(message.guild.id)
    const args = message.content.split(/ +/g)
    if (currentVc) {
      const prefix = this.client.prefix.getPrefix(message.guild.id)
        ? this.client.prefix.getPrefix(message.guild.id)
        : this.client.config.prefix
      if (!args[1]) {
        return message.say('info', stripIndent`
        \`${prefix}filter <filter>\`

        **Available Filters:** 3d, vaporwave, bassboost, demonic, earwax, echo, flanger, gate, haas, karaoke, nightcore, phaser, reverse, vibrato, off
        `, 'Usage')
      }
      try {
        const filter = this.client.player.getQueue(message).filter
        if (args[1] === filter) {
          return message.say('warn', `\`${args[1]}\` is already applied to the player.`)
        }
        await this.client.player.setFilter(message.guild.id, args[1] === 'OFF'.toLowerCase()
          ? filter
          : args[1]
        )
        return message.say('ok', args[1] === 'OFF'.toLowerCase()
          ? 'The filter has been removed from the player.'
          : `Applied filter: \`${args[1]}\``
        )
      } catch (err) {
        return message.say('error', '**Available Filters:** 3d, vaporwave, bassboost, demonic, earwax, echo, flanger, gate, haas, karaoke, nightcore, phaser, reverse, vibrato, off', `\`${args[1]}\` is not a filter.`)
      }
    } else {
      if (vc.id !== currentVc.channel.id) return message.say('error', 'You must be in the same voice channel that I\'m in to use that command.')
    }
  }
}
