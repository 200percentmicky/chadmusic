// eslint-disable-next-line no-unused-vars
const { Message, MessageEmbed, MessageActionRow } = require('discord.js')

/**
 * Allows you to create a window alert style UI utilizing `Discord.MessageEmbed`, or a standard text message if the bot doesn't have the **Embed Links** permission.
 *
 * @param {Message} msg A MessageResolvable | `Discord.Message`
 * @param {string} type The type of interface to provide. Supported are `ok` for success, `warn` for warnings, `error` for errors, `info` for information, and `no` for forbidden.
 * @param {string} description The overall message.
 * @param {string} title [Optional] The title of the embed or message.
 * @param {string} footer [Optional] The footer of the embed.
 * @param {MessageActionRow[]} buttons [Optional] The components to add to the message. Supports only `Discord.MessageButton`.
 * @returns {(MessageEmbed|Message)} The message to reply to the user.
 */
const say = (msg, type, description, title, footer, buttons) => {
  /* The color of the embed */
  const embedColor = {
    ok: process.env.COLOR_OK,
    warn: process.env.COLOR_WARN,
    error: process.env.COLOR_ERROR,
    info: process.env.COLOR_INFO,
    no: process.env.COLOR_NO
  }

  /* The emoji of the embed */
  // If the bot doesn't have permission to use external emojis, then the default emojis will be used.
  const emojiPerms = msg.channel.permissionsFor(msg.channel.client.user.id).has(['USE_EXTERNAL_EMOJIS'])
  const embedEmoji = {
    ok: emojiPerms ? process.env.EMOJI_OK : '✅',
    warn: emojiPerms ? process.env.EMOJI_WARN : '⚠',
    error: emojiPerms ? process.env.EMOJI_ERROR : '❌',
    info: emojiPerms ? process.env.EMOJI_INFO : 'ℹ',
    no: emojiPerms ? process.env.EMOJI_NO : '🚫'
  }

  const embed = new MessageEmbed()
    .setColor(embedColor[type])
    .setAuthor(`${msg.author.tag}`, `${msg.author.avatarURL({ dynamic: true })}`)

  if (title) { /* The title of the embed, if one is provided. */
    embed.setTitle(`${embedEmoji[type]} ${title}`)
    embed.setDescription(`${description}`)
  } else {
    embed.setDescription(`${embedEmoji[type]} ${description}`)
  }

  if (footer) embed.setFooter(`${footer}`)

  /* No embed */
  // If the bot doesn't have permission to embed links, then a standard formatted message will be created.
  if (msg.channel.type === 'dm') { /* DMs will always have embed links. */
    return msg.reply({ embeds: [embed], components: buttons || [], allowedMentions: { repliedUser: false } })
  } else {
    if (!msg.channel.permissionsFor(msg.channel.client.user.id).has(['EMBED_LINKS'])) {
      return msg.reply(title
        ? `\`${msg.author.toString()}\` ${embedEmoji[type]} **${title}** | ${description}`
        : `\`${msg.author.toString()}\` ${embedEmoji[type]} ${description}`
      , { components: buttons || [], allowedMentions: { repliedUser: false } })
    } else return msg.reply({ embeds: [embed], components: buttons || [], allowedMentions: { repliedUser: false } })
  }
}

/**
 * A UI element that returns the overall usage of the command if no arguments were provided.
 *
 * @example this.client.ui.usage(message, message, 'play <url|search>');
 * @param {Message} msg A MessageResolvable | `Discord.Message`
 * @param {string} syntax The usage of the command
 * @returns {MessageEmbed} The embed containg the usage of the command.
 */
const usage = (msg, syntax) => {
  const guildPrefix = msg.channel.client.settings.get(msg.id, 'prefix', process.env.PREFIX)
  const embed = new MessageEmbed()
    .setColor(process.env.COLOR_INFO)
    .setAuthor(`${msg.author.tag}`, `${msg.author.avatarURL({ dynamic: true })}`)
    .setTitle(`${process.env.EMOJI_INFO} Usage`)
    .setDescription(`\`${guildPrefix}${syntax}\``)
  if (!msg.channel.permissionsFor(msg.channel.client.user.id).has(['EMBED_LINKS'])) {
    return msg.reply(`${process.env.EMOJI_INFO} **Usage** | \`${guildPrefix}${syntax}\``)
  } else {
    return msg.reply({ embeds: [embed], allowedMentions: { repliedUser: false } })
  }
}

/**
 * A custom varient of `<Message>.say()` that allows you to input a custom emoji. If the bot has the **Embed Links** permission, a custom color can be provided to the embed.
 *
 * @param {Message} msg A MessageResolvable | `Discord.Message`
 * @param {string} emoji The emoji of the message.
 * @param {number} color [Optional] The color of the embed, if the bot has the **Embed Links** permission.
 * @param {string} description The overall message.
 * @param {string} title [Optional] The title of the message.
 * @param {string} footer [Optional] The footer of the message.
 * @param {MessageActionRow[]} buttons [Optional] The components to add to the message. Supports only `Discord.MessageButton`.
 * @returns {(MessageEmbed|Message)} The message to reply to the user.
 */
const custom = (msg, emoji, color, description, title, footer, buttons) => {
  const embed = new MessageEmbed()
    .setColor(color)
    .setAuthor(`${msg.author.tag}`, `${msg.author.avatarURL({ dynamic: true })}`)

  if (title) { /* The title of the embed, if one is provided. */
    embed.setTitle(`${emoji} ${title}`)
    embed.setDescription(`${description}`)
  } else {
    embed.setDescription(`${emoji} ${description}`)
  }

  if (footer) embed.setFooter(`${footer}`)

  if (msg.channel.type === 'dm') {
    return msg.reply({ embeds: [embed], allowedMentions: { repliedUser: false } })
  } else {
    if (!msg.channel.permissionsFor(msg.channel.client.user.id).has(['EMBED_LINKS'])) {
      return msg.reply(title
        ? `\`${msg.author.tag}\` ${emoji} **${title}** | ${description}`
        : `\`${msg.author.tag}\` ${emoji} ${description}`
      , { allowedMentions: { repliedUser: false } })
    } else return msg.reply({ embeds: [embed], components: buttons || [], allowedMentions: { repliedUser: false } })
  }
}

/**
 * A function that sends an error report to the given bug reports channel, if one was provided in the `.env` file.
 *
 * @param {Message} msg A MessageResolvable | `Discord.Message`
 * @param {string} type The type of bug report. Supported are `error` for errors, and `warn` for warnings.
 * @param {string} command [Optional] The command of the bug report.
 * @param {string} title The title of the bug report.
 * @param {string} error The error of the bug report. It's recommended to provide `<err>.stack` in this parameter.
 * @returns {MessageEmbed} The overall bug report.
 */
const recordError = async (msg, type, command, title, error) => {
  // Consider replacing the channel ID for your own error reporting
  // channel until the feature is supported in the configs.
  const errorChannel = msg.channel.client.channels.cache.get(process.env.BUG_CHANNEL)
  if (!errorChannel) return
  const embed = new MessageEmbed()
    .setTimestamp()
    .addField('Server', `${msg.channel.type === 'dm'
      ? 'Direct Message'
      : msg.guild.name + '\nID: ' + msg.guild.id}`, true
    )
    .addField('Channel', `${msg.channel.type === 'dm'
      ? 'Direct Message'
      : msg.channel.name + '\nID: ' + msg.channel.id}`, true
    )

  if (command) {
    // I was rather lazy with this one. I'm not sure if Akairo is able to
    // provide what command is invoked. Hard coding seems to not be an issue atm...
    embed.addField('Command', `${command}`, true)
  }

  if (type === 'warning') {
    msg.channel.client.logger.warn(error)
    embed.setColor(process.env.COLOR_WARN)
    embed.setTitle(`${process.env.EMOJI_WARN} ${title}`)
  }

  if (type === 'error') {
    msg.channel.client.logger.error(error)
    embed.setColor(process.env.COLOR_ERROR)
    embed.setTitle(`${process.env.EMOJI_ERROR} ${title}`)
  }

  await errorChannel.send({ embeds: [embed] })
  return errorChannel.send({ content: error, code: 'js', split: true })
}

module.exports = { say, usage, custom, recordError }
