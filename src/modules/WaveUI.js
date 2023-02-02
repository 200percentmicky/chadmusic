/**
 *  ChadMusic - The Chad Music Bot
 *  Copyright (C) 2022  Micky D. | @200percentmicky | Micky-kun#3836
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

/* eslint-disable no-multi-spaces */
/* eslint-disable no-unused-vars */

const {
    Message,
    EmbedBuilder,
    CommandInteraction,
    ActionRowBuilder,
    ColorResolvable,
    EmojiResolvable,
    BaseGuildTextChannel,
    GuildMember,
    ChannelType,
    PermissionsBitField,
    ChatInputCommandInteraction,
    InteractionResponse
} = require('discord.js');
const { CommandContext, Member } = require('slash-create');

let baseEmbed = {};
/**
 * The overall structured embed to use for the UI.
 *
 * @param {ColorResolvable} color The color of the embed.
 * @param {EmojiResolvable} emoji The emoji to add to the message.
 * @param {string} title The title of the embed.
 * @param {GuildMember|Member} author The author of the embed. Usually the member of a guild.
 * @param {string} desc The description of the embed.
 * @param {string} footer The footer of the embed.
 * @returns The object used to construct an embed.
 */
const embedUI = (color, emoji, title, desc, footer) => {
    baseEmbed = {
        color: parseInt(color),
        title: null,
        description: `${emoji} ${desc}`
    };

    if (title) {
        baseEmbed.title = `${emoji} ${title}`;
        baseEmbed.description = `${desc}`;
    }

    if (footer) {
        baseEmbed.footer = {
            text: `${footer}`
        };
    }

    return baseEmbed;
};

/**
 * The overall structured message to use for the UI.
 * Should be used if the bot doesn't have permission to embed links.
 *
 * @param {EmojiResolvable} emoji The emoji to use in the message.
 * @param {string} title The title of the message.
 * @param {GuildMember} author The author of the embed. Usually the member of a guild.
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
 * A UI function that replies to the user as an embed, or a standard text message if the bot
 * doesn't have the **Embed Links** permission. Supported types are `ok` for success, `warn`
 * for warnings, `error` for errors, `info` for information, and `no` for forbidden.
 *
 * @example <WaveUI>.reply(message, 'ok', 'The task failed successfully!')
 * @param {(Message|CommandContext|ChatInputCommandInteraction)} msg The message object or an interaction.
 * @param {string} type The type of interface to provide.
 * @param {string} description The overall message.
 * @param {string} [title] The title of the embed or message.
 * @param {string} [footer] The footer of the embed.
 * @param {ActionRowBuilder[]} [buttons] The components to add to the message. Supports only `Discord.ButtonBuilder`.
 * @param {boolean} [mention] Whether to mention the user.
 * @param {boolean} [ephemeral] Whether the response to the interaction should be ephemeral.
 * @returns {(Message|InteractionResponse)} The message to send in the channel.
 */
const reply = (msg, type, description, title, footer, ephemeral, buttons, mention) => {
    /* The emoji of the embed */
    let embedEmoji = {
        ok: process.env.EMOJI_OK ?? '✅',
        warn: process.env.EMOJI_WARN ?? '⚠',
        error: process.env.EMOJI_ERROR ?? '❌',
        info: process.env.EMOJI_INFO ?? 'ℹ',
        no: process.env.EMOJI_NO ?? '🚫'
    };

    const embed = embedUI(embedColor[type], embedEmoji[type], title || null, description || null, footer || null);
    if (msg instanceof CommandContext) {
        return msg.send({
            embeds: [embed],
            components: buttons || [],
            ephemeral: ephemeral ?? false
        });
    } else {
        const client = msg.channel.client;
        const emojiPerms = msg.channel.permissionsFor(client.user.id).has(PermissionsBitField.Flags.UseExternalEmojis);
        embedEmoji = {
            ok: emojiPerms ? process.env.EMOJI_OK : '✅',
            warn: emojiPerms ? process.env.EMOJI_WARN : '⚠',
            error: emojiPerms ? process.env.EMOJI_ERROR : '❌',
            info: emojiPerms ? process.env.EMOJI_INFO : 'ℹ',
            no: emojiPerms ? process.env.EMOJI_NO : '🚫'
        };

        if (msg.channel.type === ChannelType.DM) { /* DMs will always have embed links. */
            return msg.reply({
                embeds: [embed],
                components: buttons || [],
                ephemeral: ephemeral ?? false,
                allowedMentions: {
                    repliedUser: mention ?? false
                }
            });
        } else if (!msg.channel.permissionsFor(client.user.id).has(PermissionsBitField.Flags.EmbedLinks)) {
            return msg.reply({
                content: stringUI(embedEmoji[type], title || null, description || null),
                components: buttons || [],
                ephemeral: ephemeral ?? false,
                allowedMentions: {
                    repliedUser: mention ?? false
                }
            });
        } else {
            return msg.reply({
                embeds: [embed],
                components: buttons || [],
                ephemeral: ephemeral ?? false,
                allowedMentions: {
                    repliedUser: mention ?? false
                }
            });
        }
    }
};

/**
 * A UI function that returns the overall usage of the command if no arguments were provided.
 *
 * @example <WaveUI>.usage(message, 'play <url|search>');
 * @param {Message} msg A MessageResolvable | `Discord.Message`
 * @param {string} syntax The usage of the command
 * @returns {Message} The embed containg the usage of the command.
 */
const usage = (msg, syntax) => {
    const guildPrefix = msg.channel.client.settings.get(msg.guild.id, 'prefix') ?? process.env.PREFIX;
    const embed = new EmbedBuilder()
        .setColor(process.env.COLOR_INFO)
        .setTitle(`${process.env.EMOJI_INFO} Usage`)
        .setDescription(`\`${guildPrefix}${syntax}\``);
    if (!msg.channel.permissionsFor(msg.channel.client.user.id).has(PermissionsBitField.Flags.EmbedLinks)) {
        return msg.reply(`${process.env.EMOJI_INFO} **Usage** | \`${guildPrefix}${syntax}\``);
    } else {
        return msg.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    }
};

/**
 * A UI function that lets you reply with a custom embed with any emoji or color of your choosing.
 * If the bot doesn't have the permission to **Embed Links**, you can only apply a custom emoji.
 *
 * @param {Message} msg A MessageResolvable | `Discord.Message`
 * @param {string} emoji The emoji of the message.
 * @param {number} [color] The color of the embed, if the bot has the **Embed Links** permission.
 * @param {string} description The overall message.
 * @param {string} [title] The title of the message.
 * @param {string} [footer] The footer of the message.
 * @param {ActionRowBuilder[]} [buttons] The components to add to the message. Supports only `Discord.ButtonBuilder`.
 * @param {boolean} [mention] Whether to mention the user.
 * @param {boolean} [ephemeral] Whether the response to the interaction should be ephemeral.
 * @returns {(Message|InteractionResponse)} The message to reply to the user.
 */
const custom = (msg, emoji, color, description, title, footer, ephemeral, buttons, mention) => {
    const embed = embedUI(color, emoji || null, title || null, description || null, footer || null);
    if (msg instanceof CommandContext) {
        return msg.send({
            embeds: [embed],
            components: buttons || [],
            ephemeral: ephemeral ?? false
        });
    } else {
        if (msg.channel.type === ChannelType.DM) {
            return msg.reply({
                embeds: [embed],
                components: buttons || [],
                ephemeral: ephemeral ?? false,
                allowedMentions: {
                    repliedUser: mention ?? false
                }
            });
        } else if (!msg.channel.permissionsFor(msg.channel.client.user.id).has(PermissionsBitField.Flags.EmbedLinks)) {
            return msg.reply({
                content: stringUI(emoji || null, title || null, description || null),
                components: buttons || [],
                ephemeral: ephemeral ?? false,
                allowedMentions: {
                    repliedUser: mention ?? false
                }
            });
        } else {
            return msg.reply({
                embeds: [embed],
                components: buttons || [],
                ephemeral: ephemeral ?? false,
                allowedMentions: {
                    repliedUser: mention ?? false
                }
            });
        }
    }
};

/**
 * Contains pre-configured messages for common prompts throughout the bot.
 *
 * @param {Message|CommandContext} msg The overall message, or an interaction.
 * @param {string} prompt The prompt to provide in the message.
 * @param {any} extra Any extra variables to provide to the prompt.
 */
const send = (msg, prompt, extra) => {
    const promptMessage = {
        DJ_MODE: 'DJ Mode is currently active. You must have the DJ Role or the **Manage Channels** permission to use music commands at this time.',
        NO_DJ: 'You must be a DJ or have the **Manage Channels** permission to use that.',
        FILTER_NOT_APPLIED: `**${extra}** is not applied to the player.`,
        FILTERS_NOT_ALLOWED: 'Filters can only be applied by DJs on this server.',
        FULL_CHANNEL: 'The voice channel is full.',
        NOT_ALONE: 'You must be a DJ or have the **Manage Channels** permission to use that. However, being alone with me in the voice channel will work.',
        NOT_PLAYING: 'Nothing is currently playing on this server.',
        NOT_IN_VC: 'You\'re not in a voice channel.',
        ALREADY_SUMMONED_ELSEWHERE: 'You must be in the same voice channel that I\'m in to do that.',
        MISSING_CONNECT: `Missing **Connect** permission for <#${extra}>`,
        MISSING_SPEAK: `Missing **Request to Speak** permission for <#${extra}>.`,
        MISSING_CLIENT_PERMISSIONS: `Missing **${extra}** permission(s) to run that command.`,
        MISSING_PERMISSIONS: `You need the **${extra}** permission(s) to use that command.`,
        WRONG_TEXT_CHANNEL_MUSIC: `Music commands must be used in <#${extra}>`,
        OWNER_ONLY: 'This command can only be used by the bot owner.',
        NSFW_ONLY: 'This command must be used in NSFW channels.'
    };

    const promptColor = {
        DJ_MODE: process.env.COLOR_NO,
        NO_DJ: process.env.COLOR_NO,
        FILTER_NOT_APPLIED: process.env.COLOR_ERROR,
        FILTERS_NOT_ALLOWED: process.env.COLOR_NO,
        FULL_CHANNEL: process.env.COLOR_ERROR,
        NOT_ALONE: process.env.COLOR_NO,
        NOT_PLAYING: process.env.COLOR_WARN,
        NOT_IN_VC: process.env.COLOR_ERROR,
        ALREADY_SUMMONED_ELSEWHERE: process.env.COLOR_ERROR,
        MISSING_CONNECT: process.env.COLOR_NO,
        MISSING_SPEAK: process.env.COLOR_NO,
        MISSING_CLIENT_PERMISSIONS: process.env.COLOR_WARN,
        MISSING_PERMISSIONS: process.env.COLOR_NO,
        WRONG_TEXT_CHANNEL_MUSIC: process.env.COLOR_NO,
        OWNER_ONLY: process.env.COLOR_NO,
        NSFW_ONLY: process.env.COLOR_NO
    };

    const promptEmoji = {
        DJ_MODE: process.env.EMOJI_NO ?? '🚫',
        NO_DJ: process.env.EMOJI_NO ?? '🚫',
        FILTER_NOT_APPLIED: process.env.EMOJI_ERROR ?? '❌',
        FILTERS_NOT_ALLOWED: process.env.EMOJI_NO ?? '🚫',
        FULL_CHANNEL: process.env.EMOJI_ERROR ?? '❌',
        NOT_ALONE: process.env.EMOJI_NO ?? '🚫',
        NOT_PLAYING: process.env.EMOJI_WARN ?? '⚠',
        NOT_IN_VC: process.env.EMOJI_ERROR ?? '❌',
        ALREADY_SUMMONED_ELSEWHERE: process.env.EMOJI_ERROR ?? '❌',
        MISSING_CONNECT: process.env.EMOJI_NO ?? '🚫',
        MISSING_SPEAK: process.env.EMOJI_NO ?? '🚫',
        MISSING_CLIENT_PERMISSIONS: process.env.EMOJI_WARN ?? '⚠',
        MISSING_PERMISSIONS: process.envEMOJI_NO ?? '🚫',
        WRONG_TEXT_CHANNEL_MUSIC: process.env.EMOJI_NO ?? '🚫',
        OWNER_ONLY: process.env.EMOJI_NO ?? '🚫',
        NSFW_ONLY: '🔞'
    };

    if ((msg instanceof Message)) {
        /* No embed */
        // If the bot doesn't have permission to embed links, then a standard formatted message will be created.
        const embed = embedUI(promptColor[prompt], promptEmoji[prompt], null, promptMessage[prompt], null);
        if (msg.channel.type === ChannelType.DM) { /* DMs will always have embed links. */
            return msg.reply({
                embeds: [embed]
            });
        } else {
            if (!msg.channel.permissionsFor(msg.channel.client.user.id).has(PermissionsBitField.Flags.EmbedLinks)) {
                return msg.reply({
                    content: stringUI(promptEmoji[prompt], null, promptMessage[prompt])
                });
            } else {
                return msg.reply({
                    embeds: [embed]
                });
            }
        }
    } else { // Slash commands.
        const embed = embedUI(promptColor[prompt], promptEmoji[prompt], null, promptMessage[prompt], null);
        return msg.send({
            embeds: [embed]
        });
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

module.exports = { reply, usage, custom, send, recordError };
