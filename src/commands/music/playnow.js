const { Command } = require('discord-akairo')
const { shuffle } = require('../../aliases.json')

module.exports = class CommandPlayNow extends Command {
  constructor () {
    super('playnow', {
      aliases: ['playnow', 'pn'],
      category: '🎶 Player',
      description: {
        text: 'Plays a song regardless if there is anything currently playing.',
        usage: 'playnow <URL/search>'
      },
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS']
    })
  }

  async exec (message) {
    const args = message.content.split(/ +/g)
    const text = args.slice(1).join(' ')
    const djMode = await this.client.djMode.get(message.guild.id)
    const djRole = await this.client.djRole.get(message.guild.id)
    const dj = message.member.roles.cache.has(djRole) || message.channel.permissionsFor(message.member.user.id).has(['MANAGE_CHANNELS'])
    if (djMode) {
      if (!dj) return message.say('no', 'DJ Mode is currently active. You must have the DJ Role or the **Manage Channels** permission to use music commands at this time.', 'DJ Mode')
    }

    const vc = message.member.voice.channel
    if (!vc) return message.say('error', 'You are not in a voice channel.')

    const currentVc = this.client.voice.connections.get(message.guild.id)
    if (!currentVc) {
      const permissions = vc.permissionsFor(this.client.user.id).has(['CONNECT'])
      if (!permissions) return message.say('no', `Missing **Connect** permission for \`${vc.name}\``)
      vc.join()
    }

    if (currentVc.channel.members.size <= 3 || dj) {
      if (vc.id !== currentVc.channel.id) return message.say('error', 'You must be in the same voice channel that I\'m in to use that command.')

      message.channel.startTyping(5)
      // eslint-disable-next-line no-useless-escape
      await this.client.player.playSkip(message, text.replace(/(^\<+|\>+$)/g, ''))
      message.react(process.env.REACTION_OK)
      return message.channel.stopTyping(true)
    } else {
      return message.say('error', 'You must have the DJ role on this server, or the **Manage Channel** permission to use that command. Being alone with me works too!')
    }
  }
}
