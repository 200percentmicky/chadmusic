const { Command } = require('discord-akairo')
const { oneLine } = require('common-tags')

module.exports = class CommandBassBoost extends Command {
  constructor () {
    super('bassboost', {
      aliases: ['bassboost', 'bass'],
      category: '📢 Filter',
      description: {
        text: 'Boosts the bass of the player.',
        usage: 'bassboost <gain:int>'
      },
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS']
    })
  }

  async exec (message) {
    const args = message.content.split(/ +/g)
    const djMode = await this.client.djMode.get(message.guild.id)
    const djRole = await this.client.djRole.get(message.guild.id)
    const allowFilters = await this.client.allowFilters.get(message.guild.id)
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

    if (allowFilters === 'dj') {
      if (!dj) {
        return message.say('no', 'You must have the DJ Role or the **Manage Channels** permission to use filters.')
      }
    }

    const vc = message.member.voice.channel
    if (!vc) return message.say('error', 'You are not in a voice channel.')

    const queue = this.client.player.getQueue(message.guild.id)
    if (!queue) return message.say('warn', 'Nothing is currently playing on this server.')

    const currentVc = this.client.voice.connections.get(message.guild.id)
    if (currentVc) {
      if (!args[1]) return message.usage('bassboost <gain:int(1-100)/off>')

      if (args[1] === 'OFF'.toLowerCase()) {
        await this.client.player.setFilter(message.guild.id, 'bassboost', 'off')
        return message.custom('📢', process.env.COLOR_INFO, '**Bass Boost** Off')
      } else {
        const gain = parseInt(args[1])

        if (gain < 1 || gain > 100 || isNaN(gain)) {
          return message.say('error', 'Bass gain must be between **1** to **100**, or **"off"**.')
        }

        await this.client.player.setFilter(message.guild.id, 'bassboost', `bass=g=${gain}`)
        return message.custom('📢', process.env.COLOR_INFO, `**Bass Boost** Gain \`${gain}dB\``)
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
