const { Command } = require('discord-akairo')
const { summon } = require('../../aliases.json')

module.exports = class CommandSummon extends Command {
  constructor () {
    super(summon !== undefined ? summon[0] : 'summon', {
      aliases: summon,
      category: '🎶 Player',
      description: {
        text: 'Joins a ',
        usage: '<url/search>',
        details: '`<url/search>` The URL or search term to load.'
      },
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS']
    })
  }

  async exec (message) {
    const settings = this.client.settings.get(message.guild.id)
    const dj = message.member.roles.cache.has(settings.djRole) || message.channel.permissionsFor(message.member.user.id).has(['MANAGE_CHANNELS'])
    if (settings.djMode) {
      if (!dj) return message.say('no', 'DJ Mode is currently active. You must have the DJ Role or the **Manage Channels** permission to use music commands at this time.', 'DJ Mode')
    }

    const vc = message.member.voice.channel
    if (!vc) return message.say('error', 'You are not in a voice channel.')

    const permissions = vc.permissionsFor(this.client.user.id).has(['CONNECT'])
    if (!permissions) return message.say('no', `Missing **Connect** permission for \`${vc.name}\``)

    const currentVc = this.client.voice.connections.get(message.guild.id)
    if (currentVc) {
      if (vc.id !== currentVc.id) return message.say('error', 'I\'m currently binded to a different voice channel.')
      else return message.say('warn', 'I\'m already in a voice channel. Let\'s get this party started!')
    } else {
      vc.join()
      message.react('📥')
      return message.say('ok', `Joined **${vc.name}**.`)
    }
  }
}
