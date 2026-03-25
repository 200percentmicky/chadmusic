/// ChadMusic
/// Copyright (C) 2026  Micky | 200percentmicky
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
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');
const { Queue } = require('distube');
const { CommandContext, Member } = require('slash-create');
const { stripIndents } = require('common-tags');
const { toColonNotation } = require('colon-notation');

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
 * @param {string} footer The footer of the message.
 * @returns The constructed message.
 */
const stringUI = (emoji, title, desc, footer) => {
    let msgString = `${emoji} ${desc}`;
    if (title) msgString = `${emoji} **${title}**\n${desc}\n-# ${footer}`;
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

            let emojiPerms;
            let embedPerms;
            try {
                emojiPerms = msg.channel.permissionsFor(client.user.id).has(PermissionsBitField.Flags.UseExternalEmojis);
                embedPerms = msg.channel.permissionsFor(client.user.id).has(PermissionsBitField.Flags.EmbedLinks);
            } catch {
                emojiPerms = true;
                embedPerms = true;
            }

            embedEmoji = {
                ok: emojiPerms ? process.env.EMOJI_OK : ':white_check_mark:',
                warn: emojiPerms ? process.env.EMOJI_WARN : ':warning:',
                error: emojiPerms ? process.env.EMOJI_ERROR : ':x:',
                info: emojiPerms ? process.env.EMOJI_INFO : ':information_source:',
                no: emojiPerms ? process.env.EMOJI_NO : ':no_entry_sign:'
            };

            if (!embedPerms) {
                return msg.reply({
                    content: stringUI(embedEmoji[type], title || null, description || null, footer || null),
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
            let embedPerms;
            try {
                embedPerms = msg.channel.permissionsFor(msg.channel.client.user.id).has(PermissionsBitField.Flags.EmbedLinks);
            } catch {
                embedPerms = true;
            }

            if (!embedPerms) {
                return msg.reply({
                    content: stringUI(emoji || null, title || null, description || null, footer || null),
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
     * Returns the emoji icon of the player's volume.
     * @param {Queue} queue
     */
    static volumeEmoji (queue) {
        const volumeIcon = {
            0: ':mute:',
            50: ':speaker:',
            100: ':sound:',
            150: ':loud_sound:',
            200: ':loud_sound::zap:',
            250: ':loud_sound::zap::warning:',
            300: ':loud_sound::zap::warning:',
            350: ':loud_sound::sob::ok_hand:'
        };
        if (queue.volume >= 351) return ':loud_sound::sob::ok_hand:';
        else return volumeIcon[Math.ceil(queue.volume / 50) * 50];
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
            DJ_MODE: 'DJ Mode is currently active. You must have the DJ Role or the **Manage Messages** permission to use music commands at this time.',
            NO_DJ: 'You must be a DJ or have the **Manage Messages** permission to use that.',
            FEATURE_DISABLED: `You cannot use this command because **${extra}** is disabled on this server.`,
            FILTER_NOT_APPLIED: `**${extra}** is not applied to the player.`,
            FILTERS_NOT_ALLOWED: 'Filters can only be applied by DJs on this server.',
            FULL_CHANNEL: 'The voice channel is full.',
            NOT_ALONE: 'You must be a DJ or have the **Manage Messages** permission to use that. However, being alone with me in the voice channel will work.',
            NOT_PLAYING: 'Nothing is currently playing on this server.',
            NOT_IN_VC: 'You\'re not in a voice channel.',
            ALREADY_SUMMONED_ELSEWHERE: 'You must be in the same voice channel that I\'m in to do that.',
            MISSING_CONNECT: `Missing **Connect** permission for <#${extra}>`,
            MISSING_SPEAK: `Missing **Request to Speak** permission for <#${extra}>.`,
            MISSING_CLIENT_PERMISSIONS: `Missing **${extra}** permission(s) to run that command.`,
            MISSING_PERMISSIONS: `You need the **${extra}** permission(s) to use that command.`,
            WRONG_TEXT_CHANNEL_MUSIC: `Music commands must be used in <#${extra}>`,
            OWNER_ONLY: 'This command can only be used by the bot owner.',
            NSFW_ONLY: 'This command must be used in NSFW channels.',
            YT_NOT_ALLOWED: 'Support for YouTube is disabled.'
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
            NSFW_ONLY: 'no',
            YT_NOT_ALLOWED: 'no'
        };

        return this.reply(msg, promptType[prompt], promptMessage[prompt]);
    }

    /**
     * Display's the clients settings for a server, or globally.
     * @param {Message|CommandContext} msg A message or CommandContext
     * @param {string|"guild"|"global"} type The type of settings to show.
     */
    static async settings (msg, type = 'guild') {
        const client = msg instanceof CommandContext
            ? msg.creator.client
            : msg.client;

        const guild = msg instanceof CommandContext
            ? msg.creator.client.guilds.cache.get(msg.guildID)
            : msg.guild;

        const settings = client.settings;

        await settings.ensure(guild.id, client.defaultSettings);

        // All Settings
        const prefix = settings.get(guild.id, 'prefix'); // Server Prefix
        const djRole = settings.get(guild.id, 'djRole'); // DJ Role
        const djMode = settings.get(guild.id, 'djMode'); // Toggle DJ Mode
        const maxTime = settings.get(guild.id, 'maxTime'); // Max Song Duration
        const maxQueueLimit = settings.get(guild.id, 'maxQueueLimit'); // Max Entries in the Queue
        const allowFilters = settings.get(guild.id, 'allowFilters'); // Allow the use of Filters
        const allowFreeVolume = settings.get(guild.id, 'allowFreeVolume'); // Unlimited Volume
        const allowLinks = settings.get(guild.id, 'allowLinks'); // Allow Links
        const allowSilent = settings.get(guild.id, 'allowSilent'); // Allow Silent Tracks
        const defaultVolume = settings.get(guild.id, 'defaultVolume'); // Default Volume
        const textChannel = settings.get(guild.id, 'textChannel'); // Text Channel
        const thumbnailSize = settings.get(guild.id, 'thumbnailSize'); // Thumbnail Size
        const votingPercent = settings.get(guild.id, 'votingPercent'); // Voting Percentage
        const leaveOnEmpty = settings.get(guild.id, 'leaveOnEmpty'); // Leave on Empty
        const leaveOnFinish = settings.get(guild.id, 'leaveOnFinish'); // Leave on Finish
        const leaveOnStop = settings.get(guild.id, 'leaveOnStop'); // Leave on Stop
        const emptyCooldown = settings.get(guild.id, 'emptyCooldown'); // Empty Cooldown
        const songVcStatus = settings.get(guild.id, 'songVcStatus'); // Track Title as VC Status
        const emitSongAddAlert = settings.get(guild.id, 'emitSongAddAlert'); // Emit Song Add Alert
        const allowPorn = settings.get(guild.id, 'allowPorn'); // Allow NSFW Websites

        // ! This setting only affects videos from YouTube.
        const allowExplicit = settings.get(guild.id, 'allowExplicit', true); // Allow Explicit Content.

        let embed;
        if (type === 'global') {
            await settings.ensure('global', client.defaultGlobalSettings);

            // Global Settings
            const emitNewSongOnly = settings.get('global', 'emitNewSongOnly'); // Show New Song Only
            const streamType = settings.get('global', 'streamType'); // Audio Encoder
            const allowYouTube = settings.get('global', 'allowYouTube'); // Allow YouTube

            const encoderType = {
                0: 'Opus',
                1: 'RAW'
            };

            embed = new EmbedBuilder()
                .setColor(guild.members.me.displayColor !== 0 ? guild.members.me.displayColor : null)
                .setTitle(':globe_with_meridians: Global Settings')
                .setDescription(stripIndents`
                **Audio Encoder:** ${encoderType[streamType]}
                **Show New Song Only:** ${emitNewSongOnly === true ? 'On' : 'Off'}
                **Allow YouTube:** ${allowYouTube === true ? 'Yes' : 'No'}
                `
                )
                .setFooter({
                    text: `ChadMusic v${client.version}`,
                    iconURL: 'https://media.discordapp.net/attachments/375453081631981568/808626634210410506/deejaytreefiddy.png'
                });
        } else {
            embed = new EmbedBuilder()
                .setColor(guild.members.me.displayColor !== 0 ? guild.members.me.displayColor : null)
                .setAuthor({
                    name: `${guild.name}`,
                    iconURL: guild.iconURL({ dynamic: true })
                })
                .setTitle(':gear: Settings')
                .addFields({
                    name: ':notes: Player',
                    value: stripIndents`
                    **:interrobang: Prefix:** \`${prefix}\`
                    **:bookmark: DJ Role:** ${djRole ? `<@&${djRole}>` : 'None'}
                    **:microphone: DJ Mode:** ${djMode === true ? 'On' : 'Off'}
                    **:frame_photo: Thumbnail Size:** ${thumbnailSize === 'large' ? 'Large' : 'Small'}
                    **:loud_sound: Default Volume:** ${defaultVolume}
                    **:hash: Text Channel:** ${textChannel ? `<#${textChannel}>` : 'Any'}
                    **:mailbox_with_no_mail: Leave On Empty:** ${leaveOnEmpty === true ? 'On' : 'Off'}
                    **:checkered_flag: Leave On Finish:** ${leaveOnFinish === true ? 'On' : 'Off'}
                    **:stop_sign: Leave On Stop:** ${leaveOnStop === true ? 'On' : 'Off'}
                    **:hourglass_flowing_sand: Empty Cooldown:** ${parseInt(emptyCooldown)} seconds
                    **:speech_balloon: Track Title as VC Status:** ${songVcStatus === true ? 'On' : 'Off'}
                    **:speech_left: Emit Track Added Message:** ${emitSongAddAlert !== false ? emitSongAddAlert === 'nocreate' ? 'On (New player excluded)' : 'On' : 'Off'}
                    `
                },
                {
                    name: ':shield: Moderation',
                    value: stripIndents`
                    **:timer: Max Track Time:** ${maxTime ? toColonNotation(maxTime) : 'Unlimited'}
                    **:1234: Max Entries in the Queue:** ${maxQueueLimit || 'Unlimited'}
                    **:loudspeaker: Allow Filters:** ${allowFilters ? 'Yes' : 'No'}
                    **:joy: Unlimited Volume:** ${allowFreeVolume === true ? 'On' : 'Off'}
                    **:link: Allow Links:** ${allowLinks === true ? 'Yes' : 'No'}
                    **:underage: Allow Explicit Tracks:** ${allowExplicit === true ? 'Yes' : 'No'}
                    **:underage: Allow NSFW Websites:** ${allowPorn === true ? 'Yes' : 'No'}
                    **:shushing_face: Allow Silent Tracks:** ${allowSilent === true ? 'Yes' : 'No'}
                    **:raised_hand: Vote-skip Ratio:** ${parseFloat(votingPercent) * 100}%
                    `
                })
                .setFooter({
                    text: `ChadMusic v${client.version}`,
                    iconURL: 'https://media.discordapp.net/attachments/375453081631981568/808626634210410506/deejaytreefiddy.png'
                });
        }

        if (msg instanceof CommandContext) {
            return msg.send({ embeds: [embed] });
        } else {
            return msg.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
        }
    }

    /**
     * Sends an error report to the bot owner or to a given bug reports channel, if one
     * was provided in the `.env` file.
     *
     * @param {Client} client Discord client
     * @param {string} command The command that errored.
     * @param {string} title The title of the bug report.
     * @param {Error} error The error of the bug report.
     * @returns {Message}
     */
    static systemMessage (client, message, command, error) { // TODO: Remove 'type'.
        if (process.env.BUG_CHANNEL === 'false') return;

        let errorChannel = client.channels.cache.get(process.env.BUG_CHANNEL);
        if (!errorChannel) errorChannel = client.owner;

        const msg = `${message}${command ? `\n- Command: \`${command}\`` : ''}${error ? `\n\`\`\`js\n${error}\`\`\`\n\`\`\`js\n${error.stack ?? 'N/A'}\`\`\`` : undefined}`;

        let components = [];
        if (error) {
            const urlGithub = new ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setURL('https://github.com/200percentmicky/chadmusic')
                .setLabel('GitHub');

            const support = new ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setURL('https://discord.com/invite/qQuJ9YQ')
                .setLabel('Support Server');

            const actionRow = new ActionRowBuilder()
                .addComponents([urlGithub, support]);

            components = [actionRow];
        }

        try {
            return errorChannel.send({ content: `${msg}`, components });
        } catch {
            this.client.logger.warn('Cannot send error report to specified bug channel.');
        }
    }
}

module.exports = ChadUI;
