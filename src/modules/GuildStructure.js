const color = require('../colorcode.json')
const emoji = require('../emoji.json')
const { MessageEmbed, Guild } = require('discord.js')
const prettyms = require('pretty-ms')

class GuildStructure extends Guild {
  // Records a moderation case.
  // Anytime someone with the appropriate elavated permissions uses
  // a moderation command, the case will be recorded only if the guild
  // has a modlog channel set.
  async recordCase (type, modid, userid, reason, duration) {
    /* Gets the mod log for the guild. */
    const modlog = this.client.modlog.items.map(x => x)

    /* Gets the current amount of entries in the mod log. */
    // If there is nothing in the DB, parse a zero to start logging.
    const caseid = parseInt(Object.keys(modlog).length)

    // Embed colors!
    const colors = {
      ban: color.ban,
      kick: color.kick,
      softban: color.softban,
      unban: color.unban
    }

    const moderator = this.members.cache.get(modid) // The moderators user ID.
    const user = this.client.users.cache.find(val => val.id === userid) // The affected users ID.

    const _type = type.charAt(0).toUpperCase() + type.slice(1)
    const emojiType = {
      ban: '🔨',
      kick: '👢',
      softban: '💨',
      unban: '🕊',
      mute: '🔇',
      unmute: '🔊'
    }

    // Used to construct the embed.
    const prefix = this.client.settings.get(this.id, 'prefix')
    if (!reason) reason = `No reason provided. Type \`${prefix}reason ${caseid + 1}\` to add it.`

    const __type = `${emojiType[type]} ${_type}`
    const __reason = `**Reason:** ${reason}`

    const embed = new MessageEmbed()
      .setColor(colors[type])
      .setAuthor(user.tag, user.avatarURL({ dynamic: true }))
      .setTitle(`\`${user.id}\``)
      .setDescription(__reason)
      .setThumbnail(user.avatarURL({ dynamic: true }))
      .addField('Action', __type)
      .addField('Moderator', moderator.user.toString())
      .setTimestamp()
      .setFooter(`Case ${caseid + 1}`) // Adds 1 from the caseid variable.

    if (type === 'mute') {
      const _duration = prettyms(duration, { verbose: true })
      embed.addField('Duration', _duration)
    }

    const modlogSetting = this.client.settings.get(this.id, 'modlog') // The modlog channel.
    const modlogChannel = this.channels.cache.find(val => val.id === modlogSetting) // Get's the modlog channel for the guild.

    if (!modlogChannel) return // The modlog channel doesn't exist.

    return modlogChannel.send(embed).then(msg => {
      // Adds a case into the modlog DB.
      // Then it'll be possible to retrieve the case's message ID to edit the modlog case.
      this.client.modlog.set(this.id, caseid + 1, {
        type: type,
        mod_id: modid,
        message_id: msg.id,
        user_tag: user.tag,
        user_avatar: user.avatarURL({ dynamic: true }),
        user_id: userid,
        duration: duration || null,
        caseid: caseid + 1
      })
    }).catch(err => {
      // Some stupid shit happened idk...
      if (err.name === 'DiscordAPIError') return
      const errorChannel = this.client.channels.cache.find(val => val.id === '603735567733227531')
      const embed = new MessageEmbed()
        .setColor(color.error)
        .setTitle(emoji.error + 'Internal Error')
        .setDescription(`\`\`\`js\n${err}\`\`\``)
        .setTimestamp()
      errorChannel.send(embed)
    })
  }
}

module.exports = GuildStructure
