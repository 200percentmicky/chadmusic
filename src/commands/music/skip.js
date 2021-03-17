const { Command } = require('discord-akairo')
const { MessageEmbed } = require('discord.js')

module.exports = class CommandSkip extends Command {
  constructor () {
    super('skip', {
      aliases: ['skip', 's'],
      category: '🎶 Player',
      description: {
        text: 'Skips the currently playing song.',
        usage: '|--force/-f|',
        details: '`|--force/-f|` Only a DJ can use this. Bypasses voting and skips the currently playing song.'
      },
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS']
    })

    this.votes = new Array(0)
  }

  async exec (message) {
    const args = message.content.split(/ +/g)
    const djMode = this.client.djMode.get(message.guild.id)
    const djRole = this.client.djRole.get(message.guild.id)
    const dj = message.member.roles.cache.has(djRole) || message.channel.permissionsFor(message.member.user.id).has(['MANAGE_CHANNELS'])
    if (djMode) {
      if (!dj) return message.say('no', 'DJ Mode is currently active. You must have the DJ Role or the **Manage Channels** permission to use music commands at this time.', 'DJ Mode')
    }

    const vc = message.member.voice.channel
    if (!vc) return message.say('error', 'You are not in a voice channel.')

    const currentVc = this.client.voice.connections.get(message.guild.id)
    if (!this.client.player.isPlaying(message) || !currentVc) return message.say('warn', 'Nothing is currently playing in this server.')
    else if (vc.id !== currentVc.channel.id) return message.say('error', 'You must be in the same voice channel that I\'m in to use that command.')

    // For breaking use only.
    // this.client.player.skip(message)
    // return message.say('⏭', this.client.color.info, 'Skipped!')

    if (args[1] === ('--force' || '-f')) {
      if (!dj) return message.say('error', 'You must have the DJ role or the **Manage Channel** permission to use the `--force` flag.')
      this.client.player.skip(message)
      return message.custom('⏭', this.client.color.info, 'Skipped!')
    }

    if (currentVc.channel.members.size >= 4) {
      const vcSize = Math.round(currentVc.channel.members.size / 2)
      const neededVotes = this.votes.length >= vcSize
      const votesLeft = vcSize - this.votes.length
      if (this.votes.includes(message.author.id)) return message.say('warn', 'You already voted to skip.')
      this.votes.push(message.author.id)
      if (neededVotes) {
        this.votes = []
        this.client.player.skip(message)
        return message.custom('⏭', this.client.color.info, 'Skipped!')
      } else {
        const prefix = this.client.prefix.getPrefix(message.guild.id)
          ? this.client.prefix.getPrefix(message.guild.id)
          : this.client.config.prefix
        const embed = new MessageEmbed()
          .setColor(this.client.color.info)
          .setDescription('⏭ Skipping?')
          .setFooter(
            `${votesLeft} more vote${votesLeft === 1 ? '' : 's'} needed to skip.${dj ? ` Yo DJ, you can force skip by using '${prefix}skip --force' or '${prefix}skip -f'.` : ''}`,
            message.author.avatarURL({ dynamic: true })
          )
        return message.reply({ embed: embed, allowedMentions: { repliedUser: false } })
      }
    } else {
      this.votes = []
      this.client.player.skip(message)
      return message.custom('⏭', this.client.color.info, 'Skipped!')
    }
  }
}
