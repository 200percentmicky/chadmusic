/* eslint-disable no-multi-spaces */
const {
  Message,
  MessageEmbed,
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

const send = (msg, prompt, extra) => {
  const promptMessage = {
    DJ_MODE: 'DJ Mode is currently active. You must have the DJ Role or the **Manage Channels** permission to use music commands at this time.',
    NO_DJ: 'You must be a DJ or have the **Manage Channels** permission to use that.',
    FILTER_NOT_APPLIED: `**${extra}** is not applied to the player.`,
    FILTERS_NOT_ALLOWED: 'Filters can only be applied by DJs on this server.',
    NOT_ALONE: 'You must be a DJ or have the **Manage Channels** permission to use that. However, being alone with me in the voice channel will work.',
    NOT_PLAYING: 'Nothing is currently playing on this server.',
    NOT_IN_VC: 'You\'re not in a voice channel.',
    ALREADY_SUMMONED_ELSEWHERE: 'You must be in the same voice channel that I\'m in to do that.',
    MISSING_CONNECT: `Missing **Connect** permission for <#${extra}>`,
    MISSING_SPEAK: `Missing **Request to Speak** permission for <#${extra}>.`,
    WRONG_TEXT_CHANNEL_MUSIC: `Music commands must be used in <#${extra}>`,
    OWNER_ONLY: 'This command can only be used by the bot owner.',
    NSFW_ONLY: 'This command must be used in NSFW channels.'
  };

  const promptColor = {
    DJ_MODE: process.env.COLOR_NO,
    NO_DJ: process.env.COLOR_NO,
    FILTER_NOT_APPLIED: process.env.COLOR_ERROR,
    FILTERS_NOT_ALLOWED: process.env.COLOR_NO,
    NOT_ALONE: process.env.COLOR_NO,
    NOT_PLAYING: process.env.COLOR_WARN,
    NOT_IN_VC: process.env.COLOR_ERROR,
    ALREADY_SUMMONED_ELSEWHERE: process.env.COLOR_ERROR,
    MISSING_CONNECT: process.env.COLOR_NO,
    MISSING_SPEAK: process.env.COLOR_NO,
    WRONG_TEXT_CHANNEL_MUSIC: process.env.COLOR_NO,
    OWNER_ONLY: process.env.COLOR_NO,
    NSFW_ONLY: process.env.COLOR_NO
  };

  const emojiPerms = msg.channel.permissionsFor(msg.channel.client.user.id).has(['USE_EXTERNAL_EMOJIS']);
  const promptEmoji = {
    DJ_MODE: emojiPerms ? process.env.EMOJI_NO : '🚫',
    NO_DJ: emojiPerms ? process.env.EMOJI_NO : '🚫',
    FILTER_NOT_APPLIED: emojiPerms ? process.env.EMOJI_ERROR : '❌',
    FILTERS_NOT_ALLOWED: emojiPerms ? process.env.EMOJI_NO : '🚫',
    NOT_ALONE: emojiPerms ? process.env.EMOJI_NO : '🚫',
    NOT_PLAYING: emojiPerms ? process.env.EMOJI_WARN : '⚠',
    NOT_IN_VC: emojiPerms ? process.env.EMOJI_ERROR : '❌',
    ALREADY_SUMMONED_ELSEWHERE: emojiPerms ? process.env.EMOJI_ERROR : '❌',
    MISSING_CONNECT: emojiPerms ? process.env.EMOJI_NO : '🚫',
    MISSING_SPEAK: emojiPerms ? process.env.EMOJI_NO : '🚫',
    WRONG_TEXT_CHANNEL_MUSIC: emojiPerms ? process.env.EMOJI_NO : '🚫',
    OWNER_ONLY: emojiPerms ? process.env.EMOJI_NO : '🚫',
    NSFW_ONLY: '🔞'
  };

  /* No embed */
  // If the bot doesn't have permission to embed links, then a standard formatted message will be created.
  const embed = embedUI(promptColor[prompt], promptEmoji[prompt], null, promptMessage[prompt], null);
  if (msg.channel.type === 'dm') { /* DMs will always have embed links. */
    return msg.reply({
      embeds: [embed]
    });
  } else {
    if (!msg.channel.permissionsFor(msg.channel.client.user.id).has(['EMBED_LINKS'])) {
      return msg.reply({
        content: stringUI(promptEmoji[prompt], null, promptMessage[prompt])
      });
    } else {
      return msg.reply({
        embeds: [embed]
      });
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

module.exports = { say, reply, usage, custom, send, recordError };
