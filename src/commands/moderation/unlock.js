const { Command } = require('discord-akairo')

module.exports = class CommandUnlock extends Command {
  constructor () {
    super('unlock', {
      aliases: ['unlock'],
      category: '⚒ Moderation',
      description: {
        text: 'Allows everyone to send messages in a channel.'
      },
      clientPermissions: ['MANAGE_CHANNELS'],
      userPermissions: ['MANAGE_CHANNELS'],
      channel: 'guild'
    })
  }

  async exec (message) {
    const everyone = message.guild.roles.everyone
    const permission = message.channel.permissionsFor(everyone.id)
    const prefix = this.client.prefix.getPrefix(message.guild.id)
      ? this.client.prefix.getPrefix(message.guild.id)
      : this.client.config.prefix

    // TODO: Make it to where a role can be used instead of everyone.
    if (!permission.has('VIEW_CHANNEL')) return this.client.ui.say(message, 'error', 'This command cannot be used in private channels. (View Channel is denied for everyone)')
    else if (permission.has('SEND_MESSAGES')) return this.client.ui.say(message, 'warn', `Use \`${prefix}lock\` to lock it.`, 'This channel is already unlocked.')

    await message.channel.updateOverwrite(everyone.id, { SEND_MESSAGES: true }, `${message.author.tag} unlocked this channel. 🔓`)
    return message.custom('🔓', 0xFFCF30, `Unlocked <#${message.channel.id}>.`)
  }
}
