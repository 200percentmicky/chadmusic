const color = require('../colorcode.json')
const emoji = require('../emoji.json')
const { MessageEmbed } = require('discord.js')
const prettyms = require('pretty-ms')
const { stripIndents } = require('common-tags')

const modlog = async (msg, type, modid, userid, reason, duration) => {
  /* Gets the mod log for the guild. */
  msg.client.modlog.get(msg.guild.id).then(modlog => {
    /* Initialize array if modlog is null */
    if (modlog == null) msg.client.modlog.set(msg.guild.id, [])

    /* Gets the current amount of entries in the mod log. */
    const caseid = parseInt(modlog.length)

    // Embed colors!
    const colors = {
      ban: color.ban,
      kick: color.kick,
      softban: color.softban,
      unban: color.unban
    }

    const moderator = msg.client.members.cache.get(modid) // The moderators user ID.
    const user = msg.client.users.cache.find(val => val.id === userid) // The affected users ID.

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
    const prefix = msg.client.settings.get(msg.guild.id, 'prefix') || process.env.PREFIX
    if (!reason) reason = `No reason provided. Type \`${prefix}reason ${caseid + 1}\` to add it.`

    const __type = `${emojiType[type]} ${_type}`
    const __reason = `**Reason:** ${reason}`

    const embed = new MessageEmbed()
      .setColor(colors[type])
      .setAuthor(`${moderator.user.tag}`, moderator.user.avatarURL({ dynamic: true }))
      .setDescription(`${__reason}`)
      .setThumbnail(`${user.avatarURL({ dynamic: true })}?size=1024`)
      .addField('User', `${user.tag}`, true)
      .addField('Action', `${__type}`, true)
      .setTimestamp()
      .setFooter(`Case ${caseid + 1}`) // Adds 1 from the caseid variable.

    if (type === 'mute') {
      const _duration = prettyms(duration, { verbose: true })
      embed.addField('Duration', _duration)
    }

    const modlogSetting = msg.client.settings.get(msg.guild.id, 'modlog') // The modlog channel.
    const modlogChannel = msg.guild.channels.cache.get(modlogSetting) // Get's the modlog channel for the guild.

    embed.addField('ID', stripIndents`
    \`\`\`js\n
    User: ${user.id}
    Moderator: ${moderator.user.id}
    \`\`\`
    `)

    if (!modlogChannel) return // The modlog channel doesn't exist.

    return modlogChannel.send({ embeds: [embed] }).then(msg => {
      // Adds a case into the modlog DB.
      // Then it'll be possible to retrieve the case's message ID to edit the modlog case.
      const caseObj = {
        type: type,
        mod_id: modid,
        message_id: msg.id,
        user_tag: user.tag,
        user_avatar: user.avatarURL({ dynamic: true }),
        user_id: userid,
        duration: duration || null
      }

      msg.client.modlog.push(`${msg.guild.id}.${caseid + 1}`, caseObj)
    }).catch(err => {
      // Some stupid shit happened idk...
      if (err.name === 'DiscordAPIError') return
      const errorChannel = msg.client.channels.cache.find(val => val.id === '603735567733227531')
      const embed = new MessageEmbed()
        .setColor(color.error)
        .setTitle(`${emoji.error} Internal Error`)
        .setDescription(`\`\`\`js\n${err}\`\`\``)
        .setTimestamp()
      errorChannel.send({ embeds: [embed] })
    })
  })
}

module.exports = modlog
