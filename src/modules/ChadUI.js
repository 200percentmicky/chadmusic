/// ChadMusic - The Chad Music Bot
/// Copyright (C) 2023  Micky D. | @200percentmicky | Micky-kun#3836
///
/// This program is free software: you can redistribute it and/or modify
/// it under the terms of the GNU General Public License as published by
/// the Free Software Foundation, either version 3 of the License, or
/// (at your option) any later version.
///
/// This program is distributed in the hope that it will be useful,
/// but WITHOUT ANY WARRANTY; without even the implied warranty of
/// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
/// GNU General Public License for more details.
///
/// You should have received a copy of the GNU General Public License
/// along with this program.  If not, see <https://www.gnu.org/licenses/>.

/* eslint-disable no-multi-spaces */
/* eslint-disable no-unused-vars */

const {
    Message,
    ActionRowBuilder,
    ColorResolvable,
    EmojiResolvable,
    GuildMember,
    ChannelType,
    PermissionsBitField,
    ChatInputCommandInteraction,
    InteractionResponse,
    EmbedBuilder
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
    baseEmbed = new EmbedBuilder()
        .setColor(color)
        .setDescription(`${emoji} ${desc}`);

    if (title) {
        baseEmbed
            .setTitle(`${emoji} ${title}`)
            .setDescription(`${desc}`);
    }

    if (footer) {
        baseEmbed.setFooter({
            text: `${footer}`
        });
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
 * The bot's user interface.
 */
class ChadUI {
    /**
     * Replies to the user as an embed, or a standard text message if the bot doesn't
     * have the **Embed Links** permission. Supported types are `ok` for success, `warn`
     * for warnings, `error` for errors, `info` for information, and `no` for forbidden.
     *
     * @example <ChadUI>.reply(message, 'ok', 'The task failed successfully!')
     * @param {(Message|CommandContext|ChatInputCommandInteraction)} msg The message object or an interaction.
     * @param {string} type The type of interface to provide.
     * @param {string} description The overall message.
     * @param {string} [title] The title of the embed or message.
     * @param {string} [footer] The footer of the embed.
     * @param {ActionRowBuilder[]} [buttons] The components to add to the message. Supports only `Discord.ButtonBuilder`.
     * @param {boolean} [mention] Whether to mention the user.
     * @param {boolean} [ephemeral] Whether the response to the interaction should be ephemeral.
     * @returns {(Message|CommandContext|InteractionResponse)} The message to send in the channel.
     */
    static reply (msg, type, description, title, footer, ephemeral, buttons, mention) {
        /* The emoji of the embed */
        let embedEmoji = {
            ok: process.env.EMOJI_OK ?? ':white_check_mark:',
            warn: process.env.EMOJI_WARN ?? ':warning:',
            error: process.env.EMOJI_ERROR ?? ':x:',
            info: process.env.EMOJI_INFO ?? ':information_source:',
            no: process.env.EMOJI_NO ?? ':no_entry_sign:'
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
                ok: emojiPerms ? process.env.EMOJI_OK : ':white_check_mark:',
                warn: emojiPerms ? process.env.EMOJI_WARN : ':warning:',
                error: emojiPerms ? process.env.EMOJI_ERROR : ':x:',
                info: emojiPerms ? process.env.EMOJI_INFO : ':information_source:',
                no: emojiPerms ? process.env.EMOJI_NO : ':no_entry_sign:'
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
    }

    /**
     * Returns the overall usage of a message based command if no arguments were provided.
     *
     * @example <ChadUI>.usage(message, 'play <url|search>');
     * @param {Message} msg A MessageResolvable | `Discord.Message`
     * @param {string} syntax The usage of the command
     * @returns {Message} The embed containg the usage of the command.
     */
    static usage (msg, syntax) {
        const guildPrefix = msg.channel.client.settings.get(msg.guild.id, 'prefix') ?? process.env.PREFIX;
        let usagePrompt;
        if (!msg.channel.permissionsFor(msg.channel.client.user.id).has(PermissionsBitField.Flags.EmbedLinks)) {
            usagePrompt = stringUI(process.env.EMOJI_INFO, 'Usage', `\`\`\`${guildPrefix}${syntax}\`\`\``);
            return msg.reply({ content: usagePrompt });
        } else {
            usagePrompt = embedUI(process.env.COLOR_INFO, process.env.EMOJI_INFO, 'Usage', `\`\`\`${guildPrefix}${syntax}\`\`\``);
            return msg.reply({ embeds: [usagePrompt] });
        }
    }

    /**
     * Replies with a custom embed with any emoji or color of your choosing.
     * If the bot doesn't have the permission to **Embed Links**, you can only apply a custom emoji.
     *
     * @param {(Message|CommandContext|ChatInputCommandInteraction)} msg A MessageResolvable | `Discord.Message`
     * @param {string} emoji The emoji of the message.
     * @param {number} [color] The color of the embed, if the bot has the **Embed Links** permission.
     * @param {string} description The overall message.
     * @param {string} [title] The title of the message.
     * @param {string} [footer] The footer of the message.
     * @param {ActionRowBuilder[]} [buttons] The components to add to the message.`.
     * @param {boolean} [mention] Whether to mention the user.
     * @param {boolean} [ephemeral] Whether the response to the interaction should be ephemeral.
     * @returns {(Message|CommandContext|InteractionResponse)} The message to reply to the user.
     */
    static custom (msg, emoji, color, description, title, footer, ephemeral, buttons, mention) {
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
    }

    /**
     * Sends pre-configured messages for common prompts throughout the bot.
     *
     * @param {Message|CommandContext} msg The overall message, or an interaction.
     * @param {string} prompt The prompt to provide in the message.
     * @param {any} extra Any extra variables to provide to the prompt.
     * @returns {(Message|CommandContext|InteractionResponse)} The selected prompt.
     */
    static sendPrompt (msg, prompt, extra) {
        const promptMessage = {
            DJ_MODE: 'DJ Mode is currently active. You must have the DJ Role or the **Manage Channels** permission to use music commands at this time.',
            NO_DJ: 'You must be a DJ or have the **Manage Channels** permission to use that.',
            FEATURE_DISABLED: `You cannot use this command because **${extra}** is disabled on this server.`,
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

        const promptType = {
            DJ_MODE: 'no',
            NO_DJ: 'no',
            FEATURE_DISABLED: 'no',
            FILTER_NOT_APPLIED: 'error',
            FILTERS_NOT_ALLOWED: 'no',
            FULL_CHANNEL: 'error',
            NOT_ALONE: 'no',
            NOT_PLAYING: 'warn',
            NOT_IN_VC: 'error',
            ALREADY_SUMMONED_ELSEWHERE: 'error',
            MISSING_CONNECT: 'no',
            MISSING_SPEAK: 'no',
            MISSING_CLIENT_PERMISSIONS: 'warn',
            MISSING_PERMISSIONS: 'no',
            WRONG_TEXT_CHANNEL_MUSIC: 'no',
            OWNER_ONLY: 'no',
            NSFW_ONLY: 'no'
        };

        return this.reply(msg, promptType[prompt], promptMessage[prompt]);
    }

    /**
     * Sends an error report to the given bug reports channel, if one was provided in the `.env` file.
     *
     * @param {Client} client An instance of `Discord.Client`
     * @param {string} command [Optional] The command of the bug report.
     * @param {string} title The title of the bug report.
     * @param {Error} error The error of the bug report.
     * @returns {Message} The overall bug report.
     */
    static recordError (client, command, title, error) { // TODO: Remove 'type'.
        const errorChannel = client.channels.cache.get(process.env.BUG_CHANNEL);
        if (!errorChannel) return;

        return errorChannel.send({ content: `**${title}**${command ? ` in \`${command}\`` : ''}\n\`\`\`js\n${error}\`\`\`` });
    }
}

module.exports = ChadUI;
