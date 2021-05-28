const { Command } = require('discord-akairo')
const { MessageEmbed } = require('discord.js')

module.exports = class CommandReason extends Command {
  constructor () {
    super('reason', {
      aliases: ['reason', 'r', 'addreason', 'addr'],
      category: '⚒ Moderation',
      channel: 'guild',
      description: {
        text: 'Add or update a reason in the modlog.',
        details: '`<case_number>` The case to update the reason in.\n`<reason>` The new reason for the case.\nOnly you can update your own case. Administrators and the server owner can update any case.',
        usage: '<case_number> <reason>'
      },
      userPermissions: ['MANAGE_MESSAGES'],
      clientPermissions: ['VIEW_AUDIT_LOG']
    })
  }

  async exec (message) {
    const args = message.content.split(/ +/g)
    if (!args[1]) return
    const reason = args.slice(2).join(' ')

    const modlogCase = this.client.modlog.get(message.guild.id, args[1])
    if (!modlogCase) return message.say('error', 'That case does not exist.')
    const modlogSettings = this.client.settings.get(message.guild.id, 'modlog')
    const modlogChannel = message.guild.channels.cache.find(val => val.id === modlogSettings)
    const type = modlogCase.type

    // Begin main function.
    // Fetches the audit log for the case by the moderator's user ID in the DB.
    // message.guild.fetchAuditLogs().then(async audit => {
    // Uses the audit ID in the DB.
    // const auditEntry = audit.entries.get(modlogCase.audit_id);

    // Building the embed.
    const emojiType = {
      ban: '🔨',
      kick: '👢',
      softban: '💨',
      unban: '🕊'
    }
    const _type = modlogCase.type.charAt(0).toUpperCase() + modlogCase.type.slice(1)
    const moderator = message.guild.members.cache.get(modlogCase.mod_id)

    const __type = `**Action:** ${_type} ${emojiType[type]}\n`
    const __user = `**User:** ${modlogCase.user_tag} (\`${modlogCase.user_id}\`)\n`
    const __reason = `**Reason:** ${reason}\n`
    const __lastModified = `**Last Modified:** ${this.client.moment(new Date()).format('ddd, MMM D, YYYY k:mm:ss')}`
    const __amended = message.channel.permissionsFor(message.author.id).has(['ADMINISTRATOR']) &&
            message.author.id !== modlogCase.mod_id
      ? `**Amended:** ${message.author.tag} (\`${message.author.id}\`)\n`
      : ''

    const embed = new MessageEmbed()
      .setColor(this.client.color[modlogCase.type])
      .setAuthor(moderator.user.tag + ` (${moderator.user.id})`, moderator.user.avatarURL({ dynamic: true }))
      .setDescription(`${__type}${__user}${__reason}${__lastModified}${__amended}`)
      .setThumbnail(modlogCase.user_avatar)
      .setTimestamp()
      .setFooter(`Case ${args[1]}`)

    // Fetches the log's message so it can be changed.
    const msg = await modlogChannel.messages.fetch(modlogCase.message_id)

    // Check if the author's ID matches with the ID saved in the DB.
    if (modlogCase.mod_id !== message.author.id) {
      // If the user is an administrator or the server owner, they
      // may change cases that they did not make.

      // TODO: I would want for this to go off of the server's role hierarchy
      // in the future. Higher ranked Moderators should have this ability.
      // Not everyone can be Admin. So for now, this will do.
      if (message.channel.permissionsFor(message.author.id).has(['ADMINISTRATOR'])) {
        // Must include a reason.
        if (!reason) return message.say('warn', 'Please provide a new reason for the case.')
        if (message.author.id !== modlogCase.mod_id) embed.addField('Amended', `${message.author.toString()}\n${message.author.tag}`)
        await msg.edit(embed)
        return message.say('ok', `Case **${args[1]}** has been updated.`)
      }
      // In case that the member is not an admin.
      return message.say('error', 'You can only update cases that you created.')
    }

    // Must include a reason.
    if (!reason) return message.say('warn', 'Please provide a new reason for the case.')
    await msg.edit(embed)
    return message.say('ok', `Case **${args[1]}** has been updated.`)

    /*
        }).catch(err => {
            return message.say('error', 'Case does not exist or the audit entry has expired.');
        });
        */
  }
}
