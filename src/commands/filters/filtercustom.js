const { oneLine, stripIndents } = require('common-tags')
const { Command } = require('discord-akairo')
const ffmpeg = require('fluent-ffmpeg')

module.exports = class CommandCustomFilter extends Command {
  constructor () {
    super('customfilter', {
      aliases: ['customfilter', 'cfilter', 'cf'],
      category: '📢 Filter',
      description: {
        text: 'Allows you to add a custom FFMPEG filter to the player.',
        usage: 'customfilter <argument:str>',
        details: stripIndents`
        \`<argument:str>\` The argument to provide to FFMPEG.
        ⚠ If the argument is invalid or not supported by FFMPEG, the stream will end.
        `
      },
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS']
    })
  }

  async exec (message) {
    const args = message.content.split(/ +/g)
    const settings = this.client.settings.get(message.guild.id)
    const dj = message.member.roles.cache.has(settings.djRole) ||
      message.channel.permissionsFor(message.member.user.id).has(['MANAGE_CHANNELS'])

    if (settings.djMode) {
      if (!dj) {
        return message.say('no', oneLine`
          DJ Mode is currently active. You must have the DJ Role or the **Manage Channels** 
          permission to use music commands at this time.
        `)
      }
    }

    if (!args[1]) return message.usage('customfilter <argument:str>')

    const vc = message.member.voice.channel
    if (!vc) return message.say('error', 'You are not in a voice channel.')

    const queue = this.client.player.getQueue(message.guild.id)
    if (!queue) return message.say('warn', 'Nothing is currently playing on this server.')

    const currentVc = this.client.voice.connections.get(message.guild.id)
    if (currentVc) {
      if (args[1] === 'OFF'.toLowerCase()) {
        await this.client.player.setFilter(message.guild.id, 'custom', 'off')
        return message.custom('📢', this.client.color.info, '**Custom Filter** Removed')
      } else {
        const custom = args[1]
        // Using fluent-ffmpeg to check if the audio filter uses a valid syntax.
        ffmpeg()
          .audioFilter(custom)
          .on('error', (err, stdout, stderr) => {
            return message.say('error', err.message)
          })
        await this.client.player.setFilter(message.guild.id, 'custom', custom)
        return message.custom('📢', this.client.color.info, `**Custom Filter** Argument: \`${custom}\``)
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
