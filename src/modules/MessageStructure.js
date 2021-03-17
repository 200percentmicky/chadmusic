/* Extending Message class */
// This is the overall UI that the bot will utilize. This also contains a function to
// provide a commands usage if no arguments are provided to some commands, as well as
// catching any errors that the bot may come across.

const { MessageEmbed, Message } = require('discord.js')

module.exports = class MessageStructure extends Message {
  say (type, description, title) {
    /* The color of the embed */
    const embedColor = {
      ok: this.client.color.ok,
      warn: this.client.color.warn,
      error: this.client.color.error,
      info: this.client.color.info,
      no: this.client.color.no
    }

    /* The emoji of the embed */
    // If the bot doesn't have permission to use external emojis, then the default emojis will be used.
    const emojiPerms = this.channel.permissionsFor(this.client.user.id).has(['USE_EXTERNAL_EMOJIS'])
    const embedEmoji = {
      ok: emojiPerms ? this.client.emoji.ok : '✅',
      warn: emojiPerms ? this.client.emoji.warn : '⚠',
      error: emojiPerms ? this.client.emoji.error : '❌',
      info: emojiPerms ? this.client.emoji.info : 'ℹ',
      no: emojiPerms ? this.client.emoji.no : '🚫'
    }

    const embedIcon = {
      ok: this.client.urlicon.ok,
      warn: this.client.urlicon.warn,
      error: this.client.urlicon.error,
      info: this.client.urlicon.info,
      no: this.client.urlicon.no
    }

    const embed = new MessageEmbed()
      .setColor(embedColor[type])

    if (title) { /* The title of the embed, if one is provided. */
      embed.setAuthor(title, embedIcon[type])
      embed.setDescription(description)
    } else {
      embed.setDescription(`${embedEmoji[type]} ${description}`)
    }

    /* No embed */
    // If the bot doesn't have permission to embed links, then a standard formatted message will be created.
    if (this.channel.type === 'dm') { /* DMs will always have embed links. */
      return this.reply({ embed: embed, allowedMentions: { repliedUser: false } })
    } else {
      if (!this.channel.permissionsFor(this.client.user.id).has(['EMBED_LINKS'])) {
        return this.reply(title
          ? `${embedEmoji[type]} **${title}** | ${description}`
          : `${embedEmoji[type]} ${description}`
        , { allowedMentions: { repliedUser: false } })
      } else return this.reply({ embed: embed, allowedMentions: { repliedUser: false } })
    }
  }

  /* Command Usage Embed */
  // Used if no argument was provided to some commands.
  usage (syntax) {
    const guildPrefix = this.client.config.prefix // TODO: Add guild prefix data.
    const embed = new MessageEmbed()
      .setColor(this.client.color.info)
      .setAuthor('Usage', this.client.urlicon.info)
      .setDescription(`\`${guildPrefix}${syntax}\``)
    this.reply({ embed: embed, allowedMentions: { repliedUser: false } })
  }

  /* Custom Embed */
  custom (emoji, color, description, title) {
    const embed = new MessageEmbed()
      .setColor(color)

    if (title) { /* The title of the embed, if one is provided. */
      embed.setTitle(`${emoji} ${title}`)
      embed.setDescription(description)
    } else {
      embed.setDescription(`${emoji} ${description}`)
    }

    if (this.channel.type === 'dm') {
      return this.reply({ embed: embed, allowedMentions: { repliedUser: false } })
    } else {
      if (!this.channel.permissionsFor(this.client.user.id).has(['EMBED_LINKS'])) {
        return this.reply(title
          ? `${emoji} **${title}** | ${description}`
          : `${emoji} ${description}`
        , { allowedMentions: { repliedUser: false } })
      } else return this.reply({ embed: embed, allowedMentions: { repliedUser: false } })
    }
  }

  // TODO: Replace this. This is only useful for my case.
  // Error Handling. Used to send to the support server.
  // This will not be useful if self-hosting this bot.
  async recordError (type, command, title, error) {
    // Consider replacing the channel ID for your own error reporting
    // channel until the feature is supported in the configs.
    const errorChannel = this.client.channels.cache.get('603735567733227531')
    const embed = new MessageEmbed()
      .setTimestamp()
      .addField('Server', this.channel.type === 'dm'
        ? 'Direct Message'
        : this.guild.name + '\nID: ' + this.guild.id, true
      )
      .addField('Channel', this.channel.type === 'dm'
        ? 'Direct Message'
        : this.channel.name + '\nID: ' + this.channel.id, true
      )

    if (command) {
      // I was rather lazy with this one. I'm not sure if Akairo is able to
      // provide what command is invoked. Hard coding seems to not be an issue atm...
      embed.addField('Command', command, true)
    }

    if (type === 'warning') {
      this.client.logger.warn(error)
      embed.setColor(this.client.color.warn)
      embed.setTitle(this.client.emoji.warn + title)
    }

    if (type === 'error') {
      this.client.logger.error(error)
      embed.setColor(this.client.color.error)
      embed.setTitle(this.client.emoji.error + title)
    }

    await errorChannel.send(embed)
    return errorChannel.send(error, { code: 'js', split: true })
  }
}
