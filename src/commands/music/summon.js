const { Command } = require('discord-akairo')
const { Permissions } = require('discord.js')

module.exports = class CommandSummon extends Command {
  constructor () {
    super('summon', {
      aliases: ['summon', 'join'],
      category: '🎶 Music',
      description: {
        text: 'Summons the bot to a voice channel.'
      },
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS']
    })
  }

  async exec (message) {
    const djMode = this.client.settings.get(message.guild.id, 'djMode')
    const djRole = this.client.settings.get(message.guild.id, 'djRole')
    const dj = message.member.roles.cache.has(djRole) || message.channel.permissionsFor(message.member.user.id).has(['MANAGE_CHANNELS'])
    if (djMode) {
      if (!dj) return message.say('no', 'DJ Mode is currently active. You must have the DJ Role or the **Manage Channels** permission to use music commands at this time.', 'DJ Mode')
    }

    const vc = message.member.voice.channel
    if (!vc) return message.say('error', 'You are not in a voice channel.')

    const permissions = vc.permissionsFor(this.client.user.id).has(['CONNECT'])
    if (!permissions) return message.say('no', `Missing **Connect** permission for <#${vc.id}>`)

    const currentVc = this.client.voice.connections.get(message.guild.id)
    if (currentVc) {
      if (vc.id !== currentVc.id) return message.say('error', 'I\'m currently binded to a different voice channel.')
      else return message.say('info', 'I\'m already in a voice channel. Let\'s get this party started!')
    } else {
      if (vc.type === 'stage') {
        await vc.join() // Must be awaited only if the VC is a Stage Channel.
        message.custom('📥', 0x77B255, `Joined \`${vc.name}\``)
        const stageMod = vc.permissionsFor(this.client.user.id).has(Permissions.STAGE_MODERATOR)
        if (!stageMod) {
          const requestToSpeak = vc.permissionsFor(this.client.user.id).has(['REQUEST_TO_SPEAK'])
          if (!requestToSpeak) {
            vc.leave()
            return message.say('no', `Missing **Request to Speak** permission for <#${vc.id}>.`)
          } else if (message.guild.me.voice.suppress) {
            await message.guild.me.voice.setRequestToSpeak(true)
            return message.say('info', `Since I'm not a **Stage Moderator** for <#${vc.id}>, please accept my request to speak on stage.`)
          }
        } else {
          await message.guild.me.voice.setSuppressed(false)
        }
      } else {
        vc.join()
      }
      return message.custom('📥', 0x77B255, `Joined <#${vc.id}>`)
    }
  }
}
