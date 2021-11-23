/* eslint-disable no-multi-spaces */
const {
  Message,
  MessageEmbed,
  MessageActionRow, /* eslint-disable-line no-unused-vars */
  ColorResolvable,  /* eslint-disable-line no-unused-vars */
  EmojiResolvable,  /* eslint-disable-line no-unused-vars */
  Client,
  Permissions,
  BaseGuildTextChannel
} = require('discord.js');
const slash = require('slash-create');

let baseEmbed = {};
/**
 * The overall structured embed to use for the UI.
 *
 * @param {ColorResolvable} color The color of the embed.
 * @param {EmojiResolvable} emoji The emoji to add to the message.
 * @param {string} title The title of the embed.
 * @param {string} desc The description of the embed.
 * @param {string} footer The footer of the embed.
 * @returns The object used to construct an embed.
 */
const embedUI = (color, emoji, title, desc, footer) => {
  baseEmbed = {
    color: parseInt(color),
    title: null,
    description: `${emoji} ${desc}`,
    footer: null
  };

  if (title) {
    baseEmbed.title = `${emoji} ${title}`;
    baseEmbed.description = `${desc}`;
  }

  if (footer) baseEmbed.footer = { text: footer };

  return baseEmbed;
};

/**
 * The overall structured message to use for the UI.
 * Should be used if the bot doesn't have permission to embed links.
 *
 * @param {*} emoji The emoji to use in the message.
 * @param {*} title The title of the message.
 * @param {*} desc The description of the message.
 * @returns The constructed message.
 */
const stringUI = (emoji, title, desc) => {
  let msgString = `${emoji} ${desc}`;
  if (title) msgString = `${emoji} **${title}**\n${desc}`;
  return msgString;
};

// Embed colors
const embedColor = {
  ok: process.env.COLOR_OK,
  warn: process.env.COLOR_WARN,
  error: process.env.COLOR_ERROR,
  info: process.env.COLOR_INFO,
  no: process.env.COLOR_NO
};

/**
 * Allows you to create a window alert style UI utilizing `Discord.MessageEmbed`, or a standard text message if the bot doesn't have the **Embed Links** permission.
 *
 * @param {BaseGuildTextChannel} channel A ChannelResolvable
 * @param {string} type The type of interface to provide. Supported are `ok` for success, `warn` for warnings, `error` for errors, `info` for information, and `no` for forbidden.
 * @param {string} description The overall message.
 * @param {string} title [Optional] The title of the embed or message.
 * @param {string} footer [Optional] The footer of the embed.
 * @param {MessageActionRow[]} buttons [Optional] The components to add to the message. Supports only `Discord.MessageButton`.
 * @returns {Message} The message to send in the channel.
 */
const say = (channel, type, description, title, footer, buttons) => {
  if (!(channel instanceof BaseGuildTextChannel)) throw new TypeError('Parameter "channel" must be an instance of "BaseGuildTextChannel".');

  /* The emoji of the embed */
  // If the bot doesn't have permission to use external emojis, then the default emojis will be used.
  const emojiPerms = channel.permissionsFor(channel.client.user.id).has(['USE_EXTERNAL_EMOJIS']);
  const embedEmoji = {
    ok: emojiPerms ? process.env.EMOJI_OK : '✅',
    warn: emojiPerms ? process.env.EMOJI_WARN : '⚠',
    error: emojiPerms ? process.env.EMOJI_ERROR : '❌',
    info: emojiPerms ? process.env.EMOJI_INFO : 'ℹ',
    no: emojiPerms ? process.env.EMOJI_NO : '🚫'
  };

  /* No embed */
  // If the bot doesn't have permission to embed links, then a standard formatted message will be created.
  const embed = embedUI(embedColor[type], embedEmoji[type], title || null, description || null, footer || null);
  if (channel.type === 'dm') { /* DMs will always have embed links. */
    return channel.send({
      embeds: [embed],
      components: buttons || []
    });
  } else {
    if (!channel.permissionsFor(channel.client.user.id).has(['EMBED_LINKS'])) {
      return channel.send({
        content: stringUI(embedEmoji[type], title || null, description || null),
        components: buttons || []
      });
    } else {
      return channel.send({
        embeds: [embed],
        components: buttons || []
      });
    }
  }
};

/**
 * Similar to `Message.say()` but replies to the user instead.
 *
 * @param {Message} msg A MessageResolvable
 * @param {string} type The type of interface to provide. Supported are `ok` for success, `warn` for warnings, `error` for errors, `info` for information, and `no` for forbidden.
 * @param {string} description The overall message.
 * @param {string} title [Optional] The title of the embed or message.
 * @param {string} footer [Optional] The footer of the embed.
 * @param {MessageActionRow[]} buttons [Optional] The components to add to the message. Supports only `Discord.MessageButton`.
 * @returns {Message} The message to send in the channel.
 */
const reply = (msg, type, description, title, footer, buttons) => {
  if (!(msg instanceof Message)) throw new TypeError('Parameter "msg" must be an instance of "Message".');

  /* The emoji of the embed */
  // If the bot doesn't have permission to use external emojis, then the default emojis will be used.
  const emojiPerms = msg.channel.permissionsFor(msg.channel.client.user.id).has(['USE_EXTERNAL_EMOJIS']);
  const embedEmoji = {
    ok: emojiPerms ? process.env.EMOJI_OK : '✅',
    warn: emojiPerms ? process.env.EMOJI_WARN : '⚠',
    error: emojiPerms ? process.env.EMOJI_ERROR : '❌',
    info: emojiPerms ? process.env.EMOJI_INFO : 'ℹ',
    no: emojiPerms ? process.env.EMOJI_NO : '🚫'
  };

  /* No embed */
  // If the bot doesn't have permission to embed links, then a standard formatted message will be created.
  const embed = embedUI(embedColor[type], embedEmoji[type], title || null, description || null, footer || null);
  if (msg.channel.type === 'dm') { /* DMs will always have embed links. */
    return msg.reply({
      embeds: [embed],
      components: buttons || [],
      allowedMentions: {
        repliedUser: true
      }
    });
  } else {
    if (!msg.channel.permissionsFor(msg.channel.client.user.id).has(['EMBED_LINKS'])) {
      return msg.reply({
        content: stringUI(embedEmoji[type], title || null, description || null),
        components: buttons || [],
        allowedMentions: {
          repliedUser: false
        }
      });
    } else {
      return msg.reply({
        embeds: [embed],
        components: buttons || [],
        allowedMentions: {
          repliedUser: false
        }
      });
    }
  }
};

/**
 * Functions the same as `say()`, but is used strictly for slash commands as an interaction. This function relies on the `slash-create` package as a peer dependency, and should be converted for use with `discord.js` instead.
 *
 * @param {slash.CommandContext} ctx The CommandContext interaction.
 * @param {Client} client The instance of `Discord.Client`.
 * @param {string} type The type of interface to provide. Supported are `ok` for success, `warn` for warnings, `error` for errors, `info` for information, and `no` for forbidden.
 * @param {boolean} ephemeral Whether the message should be sent as an ephemeral message to the user.
 * @param {string} description The overall message.
 * @param {string} title [Optional] The title of the embed or message.
 * @param {string} footer [Optional] The footer of the embed.
 * @param {MessageActionRow[]} buttons [Optional] The components to add to the message. Supports only `Discord.MessageButton`.
 * @returns {Promise<boolean | Message>} The message to send when an interaction is resolved.
 */
const ctx = (ctx, client, type, ephemeral, description, title, footer, buttons) => {
  if (!(ctx instanceof slash.CommandContext)) throw new TypeError('Parameter "ctx" must be an instance of "CommandContext".');
  if (!(client instanceof Client)) throw new TypeError('Parameter "client" must be an instance of "Client".');

  const channel = client.channels.cache.get(ctx.channelID);

  /* The emoji of the embed */
  // If the bot doesn't have permission to use external emojis, then the default emojis will be used.
  const emojiPerms = channel.permissionsFor(client.user.id).has(Permissions.FLAGS.USE_EXTERNAL_EMOJIS);
  const embedEmoji = {
    ok: emojiPerms ? process.env.EMOJI_OK : '✅',
    warn: emojiPerms ? process.env.EMOJI_WARN : '⚠',
    error: emojiPerms ? process.env.EMOJI_ERROR : '❌',
    info: emojiPerms ? process.env.EMOJI_INFO : 'ℹ',
    no: emojiPerms ? process.env.EMOJI_NO : '🚫'
  };

  const embed = embedUI(embedColor[type], embedEmoji[type], title || null, description || null, footer || null);
  /* No embed */
  // If the bot doesn't have permission to embed links, then a standard formatted message will be created.
  if (channel.type === 'dm') { /* DMs will always have embed links. */
    return ctx.send({
      embeds: [embed],
      components: buttons || [],
      ephemeral: false // DMs do not need ephemeral messages in my opinion.
    });
  } else {
    if (!channel.permissionsFor(client.user.id).has(Permissions.FLAGS.EMBED_LINKS)) {
      return ctx.send(stringUI(embedEmoji[type], title || null, description || null), { components: buttons || [] });
    } else {
      return ctx.send({
        embeds: [embed],
        components: buttons || [],
        ephemeral: ephemeral
      });
    }
  }
};

/**
 * A custom varient of `ui.ctx()` which allows you to create a custom embed or text message.
 *
 * @param {slash.CommandContext} ctx The CommandContext interaction.
 * @param {Client} client The instance of `Discord.Client`.
 * @param {boolean} ephemeral Whether the message should be sent as an ephemeral message to the user.
 * @param {string} emoji The emoji of the message.
 * @param {number} color The color of the embed.
 * @param {string} description The overall message.
 * @param {string} title [Optional] The title of the embed or message.
 * @param {string} footer [Optional] The footer of the embed.
 * @param {MessageActionRow[]} buttons [Optional] The components to add to the message. Supports only `Discord.MessageButton`.
 * @returns {Promise<boolean | Message>} The message to send when an interaction is resolved.
 */
const ctxCustom = (ctx, client, ephemeral, emoji, color, description, title, footer, buttons) => {
  if (!(ctx instanceof slash.CommandContext)) throw new TypeError('Parameter "ctx" must be an instance of "CommandContext".');
  if (!(client instanceof Client)) throw new TypeError('Parameter "client" must be an instance of "Client".');

  const channel = client.channels.cache.get(ctx.channelID);

  const embed = embedUI(color, emoji, title || null, description || null, footer || null);
  /* No embed */
  // If the bot doesn't have permission to embed links, then a standard formatted message will be created.
  if (channel.type === 'dm') { /* DMs will always have embed links. */
    return ctx.send({
      embeds: [embed],
      components: buttons || [],
      ephemeral: false // DMs do not need ephemeral messages in my opinion.
    });
  } else {
    if (!channel.permissionsFor(client.user.id).has(Permissions.FLAGS.EMBED_LINKS)) {
      return ctx.send(stringUI(emoji, title || null, description || null), { components: buttons || [] });
    } else {
      return ctx.send({
        embeds: [embed],
        components: buttons || [],
        ephemeral: ephemeral
      });
    }
  }
};

/**
 * A UI element that returns the overall usage of the command if no arguments were provided.
 *
 * @example this.client.ui.usage(message, message, 'play <url|search>');
 * @param {Message} msg A MessageResolvable | `Discord.Message`
 * @param {string} syntax The usage of the command
 * @returns {Message} The embed containg the usage of the command.
 */
const usage = (msg, syntax) => {
  if (!(msg instanceof Message)) throw new TypeError('Parameter "msg" must be an instance of "Message".');

  const guildPrefix = msg.channel.client.settings.get(msg.id, 'prefix', process.env.PREFIX);
  const embed = new MessageEmbed()
    .setColor(process.env.COLOR_INFO)
    .setTitle(`${process.env.EMOJI_INFO} Usage`)
    .setDescription(`\`${guildPrefix}${syntax}\``);
  if (!msg.channel.permissionsFor(msg.channel.client.user.id).has(['EMBED_LINKS'])) {
    return msg.reply(`${process.env.EMOJI_INFO} **Usage** | \`${guildPrefix}${syntax}\``);
  } else {
    return msg.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
  }
};

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
 * @returns {Message} The message to reply to the user.
 */
const custom = (msg, emoji, color, description, title, footer, buttons) => {
  if (!(msg instanceof Message)) throw new TypeError('Parameter "msg" must be an instance of "Message".');

  const embed = embedUI(color, emoji || null, title || null, description || null, footer || null);
  if (msg.channel.type === 'dm') {
    return msg.reply({
      embeds: [embed],
      allowedMentions: {
        repliedUser: false
      }
    });
  } else {
    if (!msg.channel.permissionsFor(msg.channel.client.user.id).has(['EMBED_LINKS'])) {
      return msg.reply(stringUI(emoji || null, title || null, description || null)
        , { allowedMentions: { repliedUser: false } });
    } else {
      return msg.reply({
        embeds: [embed],
        components: buttons || [],
        allowedMentions: {
          repliedUser: false
        }
      });
    }
  }
};

/**
 * A function that sends an error report to the given bug reports channel, if one was provided in the `.env` file.
 *
 * @param {Message} msg A MessageResolvable | `Discord.Message`
 * @param {string} type The type of bug report. Supported are `error` for errors, and `warn` for warnings.
 * @param {string} command [Optional] The command of the bug report.
 * @param {string} title The title of the bug report.
 * @param {string} error The error of the bug report. It's recommended to provide `<err>.stack` in this parameter.
 * @returns {Message} The overall bug report.
 */
const recordError = async (msg, type, command, title, error) => { // TODO: Remove 'type'.
  const errorChannel = msg.channel.client.channels.cache.get(process.env.BUG_CHANNEL);
  if (!errorChannel) return;

  return errorChannel.send({ content: `**${title}**${command ? ` in \`${command}\`` : ''}\n\`\`\`js\n${error}\`\`\`` });
};

module.exports = { say, reply, ctx, ctxCustom, usage, custom, recordError };
