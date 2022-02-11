/* eslint-disable no-multi-spaces */
const {
  MessageActionRow, /* eslint-disable-line no-unused-vars */
  ColorResolvable,  /* eslint-disable-line no-unused-vars */
  EmojiResolvable,  /* eslint-disable-line no-unused-vars */
  BaseGuildTextChannel
} = require('discord.js');

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
 * @param {EmojiResolvable} emoji The emoji to use in the message.
 * @param {string} title The title of the message.
 * @param {string} desc The description of the message.
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
 * @param {MessageActionRow[]} buttons [Optional] The components to add to the message.
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
    return {
      embeds: [embed],
      components: buttons || []
    };
  } else {
    if (!channel.permissionsFor(channel.client.user.id).has(['EMBED_LINKS'])) {
      return {
        content: stringUI(embedEmoji[type], title || null, description || null),
        components: buttons || []
      };
    } else {
      return {
        embeds: [embed],
        components: buttons || []
      };
    }
  }
};

/**
 * Similar to `ui.say()`, but sent as an ephemeral message to the user.
 *
 * @param {BaseGuildTextChannel} channel A ChannelResolvable
 * @param {string} type The type of interface to provide. Supported are `ok` for success, `warn` for warnings, `error` for errors, `info` for information, and `no` for forbidden.
 * @param {string} description The overall message.
 * @param {string} title [Optional] The title of the embed or message.
 * @param {string} footer [Optional] The footer of the embed.
 * @param {MessageActionRow[]} buttons [Optional] The components to add to the message.
 * @returns {Message} The message to send in the channel.
 */
const secret = (channel, type, description, title, footer, buttons) => {
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
    return {
      embeds: [embed],
      components: buttons || [],
      ephemeral: true
    };
  } else {
    if (!channel.permissionsFor(channel.client.user.id).has(['EMBED_LINKS'])) {
      return {
        content: stringUI(embedEmoji[type], title || null, description || null),
        components: buttons || []
      };
    } else {
      return {
        embeds: [embed],
        components: buttons || [],
        ephemeral: true
      };
    }
  }
};

/**
 * A custom varient of `<Message>.say()` that allows you to input a custom emoji. If the bot has the **Embed Links** permission, a custom color can be provided to the embed.
 *
 * @param {BaseGuildTextChannel} msg A MessageResolvable | `Discord.Message`
 * @param {string} emoji The emoji of the message.
 * @param {number} color [Optional] The color of the embed, if the bot has the **Embed Links** permission.
 * @param {string} description The overall message.
 * @param {string} title [Optional] The title of the message.
 * @param {string} footer [Optional] The footer of the message.
 * @param {MessageActionRow[]} buttons [Optional] The components to add to the message.
 * @param {boolean} ephemeral [Optional] Whether the message is sent as an ephemeral message.
 * @returns {Message} The message to reply to the user.
 */
const custom = (channel, emoji, color, description, title, footer, buttons, ephemeral) => {
  if (!(channel instanceof BaseGuildTextChannel)) throw new TypeError('Parameter "msg" must be an instance of "Message".');

  const embed = embedUI(color, emoji || null, title || null, description || null, footer || null);
  if (channel.type === 'dm') {
    return {
      embeds: [embed],
      components: buttons || [],
      ephemeral: ephemeral
    };
  } else {
    if (!channel.permissionsFor(channel.client.user.id).has(['EMBED_LINKS'])) {
      return {
        content: stringUI(emoji || null, title || null, description || null),
        components: buttons || [],
        ephemeral: ephemeral
      };
    } else {
      return {
        embeds: [embed],
        components: buttons || [],
        ephemeral: ephemeral
      };
    }
  }
};

/**
 * A function that sends an error report to the given bug reports channel, if one was provided in the `.env` file.
 *
 * @param {Client} client An instance of `Discord.Client`
 * @param {string} command [Optional] The command of the bug report.
 * @param {string} title The title of the bug report.
 * @param {string} error The error of the bug report. It's recommended to provide `<err>.stack` in this parameter.
 * @returns {Message} The overall bug report.
 */
const recordError = async (client, command, title, error) => { // TODO: Remove 'type'.
  const errorChannel = client.channels.cache.get(process.env.BUG_CHANNEL);
  if (!errorChannel) return;

  return errorChannel.send({ content: `**${title}**${command ? ` in \`${command}\`` : ''}\n\`\`\`js\n${error}\`\`\`` });
};

module.exports = { say, secret, custom, recordError };
