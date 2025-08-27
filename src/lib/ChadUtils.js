/// ChadMusic
/// Copyright (C) 2025  Micky | 200percentmicky
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

/* eslint-disable no-unused-vars */
const {
    Client,
    GuildMember,
    BaseGuildVoiceChannel,
    PermissionsBitField,
    Message,
    BaseGuildTextChannel,
    Team,
    ChatInputCommandInteraction
} = require('discord.js');
const { CommandContext } = require('slash-create');
const ChadError = require('./ChadError.js');
const ytdl = require('@distube/ytdl-core');
const { getRandomIPv6 } = require('@distube/ytdl-core/lib/utils.js');
/* eslint-enable no-unused-vars */

/**
 * A set of custom utilities for the bot to use.
 */
class ChadUtils {
    /**
     * Verifys if the user is in the same voice channel as the client.
     * @param {Client} client Discord Client
     * @param {GuildMember} member GuildMember
     * @param {BaseGuildVoiceChannel} vc The voice channel.
     * @returns {boolean}
     */
    static isSameVoiceChannel (client, member, vc) {
        const queue = client.player?.getQueue(member.guild);
        let channelId;
        try {
            channelId = queue.voice?.connection.joinConfig.channelId;
        } catch {
            channelId = client.vc.get(vc).channel.id;
        }

        return channelId === vc.id;
    }

    /**
     * Creates a new ytdl agent.
     *
     * @param {Client} client Discord client.
     */
    static async createAgent (client) {
        try {
            if (process.env.PROXY) {
                client.player.youtube.ytdlOptions.agent = ytdl.createProxyAgent({
                    uri: process.env.PROXY ?? '',
                    localAddress: process.env.IPV6_BLOCK ? getRandomIPv6(process.env.IPV6_BLOCK) : undefined
                }, client.cookies());
            } else {
                client.player.youtube.ytdlOptions.agent = ytdl.createAgent(client.cookies(), {
                    localAddress: process.env.IPV6_BLOCK ? getRandomIPv6(process.env.IPV6_BLOCK) : undefined
                });
            }
        } catch (err) {
            client.logger.error(`Failed to create an agent.\n${err.stack}`);
        }
    }

    /**
     * Checks if a user is a DJ in a guild.
     * @param {BaseGuildTextChannel} channel A text channel.
     * @param {GuildMember} member The guild member to check for DJ permissions.
     * @returns {boolean}
     */
    static isDJ (channel, member) {
        const isOwner = () => {
            if (!channel.client.player.sudoAccess.includes(channel.guild.id)) {
                return false;
            }

            if (this.client.owner instanceof Team) {
                return member.user.id === channel.client.owner.members.get(member.user.id).id;
            }

            return member.user?.id === channel.client.owner?.id;
        };

        const djRole = channel.client.settings.get(channel.guild.id, 'djRole');
        const permission = member.roles?.cache?.has(djRole) ||
            channel.permissionsFor(member.user?.id).has(PermissionsBitField.Flags.ManageChannels) ||
            isOwner();

        return permission;
    }

    // TODO: Revert this to just a REST function. For now, this fixes a bug.
    /**
     * Sets the status for the connected voice channel. If repeat mode is set
     * to 1 (repeat song), the "status" parameter is ignored and the status is
     * automatically set to the looped track.
     *
     * ⚠ **Experimental:** Uses an undocumented endpoint in Discord's API
     * and might change in the future.
     *
     * @param {BaseGuildVoiceChannel} vc Guild based voice channel.
     * @param {string|null} [status] The new status to set.
     * @param {string|null} [reason] The reason for the change.
     */
    static async setVcStatus (vc, status = null, reason = null) {
        if (!vc || !(vc instanceof BaseGuildVoiceChannel)) {
            throw new ChadError(null, null, 'A voice channel must be provided.');
        }

        vc.client.settings.ensure(vc.guild.id, vc.client.defaultSettings);

        const songVcStatus = vc.client.settings.get(vc.guild.id, 'songVcStatus');
        const queue = vc.client.player.getQueue(vc.guild.id);

        if (songVcStatus !== true) return;

        if (!queue) { // eslint-disable-line no-empty
        } else if (queue.repeatMode === 1) {
            const song = queue.songs[0];
            status = `${process.env.EMOJI_MUSIC} ${song.name} [${song.formattedDuration}] (${song.user.displayName} - ${song.user.username})`;
        }

        try {
            await vc.client.rest.put(`/channels/${vc.id}/voice-status`, {
                body: {
                    status
                },
                reason
            });
        } catch (err) {
            vc.client.logger.error(`Failed to set voice channel status.\n${err.stack}`);
        }
    }

    /**
     * Attaches additional metadata from the Discord.js Client to a CommandContext interaction.
     * @param {Client} client
     * @param {CommandContext} ctx
     */
    static attach (client, ctx) {
        const guild = client.guilds.cache.get(ctx.guildID);

        ctx.guild = guild;

        if (guild.available) {
            ctx._channel = guild.channels.cache.get(ctx.channelID);
            ctx._member = guild.members.cache.get(ctx.user.id);
        }
    }

    /**
     * Attempts to execute a standard prefix command from a command interaction.
     *
     * @param {ChatInputCommandInteraction} interaction The command's interaction.
     * @param {string} commandName The name of the command.
     * @param {Object} args Arguments to pass to the command.
     * @returns The execution of the prefix command.
     * @throws Command not found.
     */
    static async handleCommand (interaction, commandName, args = {}) {
        if (!interaction.deferred) {
            throw new ChadError('NOT_DEFERRED', null, 'Interaction must be deferred.');
        }

        interaction.author = interaction.member;
        interaction.react = (emoji) => {
            return interaction.reply(emoji, { ephemeral: true });
        };

        try {
            const command = await interaction.client.commands.findCommand(commandName);
            return interaction.client.commands.runCommand(interaction, command, args);
        } catch (err) {
            throw new ChadError('COMMAND_ERROR', null, `Error finding or running ${commandName}: ${err}`);
        }
    }

    /**
     * Returns a formatted list of all permissions listed in PermissionFlagsBit.
     *
     * https://discord-api-types.dev/api/discord-api-types-v10#PermissionFlagsBits
     */
    static permissionBits () {
        return {
            AddReactions: 'Add Reactions',
            Administrator: 'Administrator',
            AttachFiles: 'Attach Files',
            BanMembers: 'Ban Members',
            ChangeNickname: 'Change Nickname',
            Connect: 'Connect',
            CreateEvents: 'Create Events',
            CreateGuildExpressions: 'Create Expressions',
            CreateInstantInvite: 'Create Instant Invite',
            CreatePrivateThreads: 'Create Private Threads',
            CreatePublicThreads: 'Create Public Threads',
            DeafenMembers: 'Deafen Members',
            EmbedLinks: 'Embed Links',
            KickMembers: 'Kick Members',
            ManageChannels: 'Manage Channels',
            ManageEvents: 'Manage Events',
            ManageGuild: 'Manage Server',
            ManageGuildExpressions: 'Manage Expressions',
            ManageMessages: 'Manage Messages',
            ManageNicknames: 'Manage Nicknames',
            ManageRoles: 'Manage Roles',
            ManageThreads: 'Manage Threads',
            ManageWebhooks: 'Manage Webhooks',
            MentionEveryone: 'Mention @everyone, @here, and All Roles',
            ModerateMembers: 'Timeout Members',
            MoveMembers: 'Move Members',
            MuteMembers: 'Mute Members',
            PinMessages: 'Pin Messages',
            PrioritySpeaker: 'Priority Speaker',
            ReadMessageHistory: 'Read Message History',
            RequestToSpeak: 'Request to Speak',
            SendMessages: 'Send Messages',
            SendMessagesInThreads: 'Send Messages in Threads',
            SendPolls: 'Create Polls',
            SendTTSMessages: 'Send Text-To-Speech Messages',
            SendVoiceMessages: 'Send Voice Messages',
            Speak: 'Speak',
            Stream: 'Stream',
            UseApplicationCommands: 'Use Application Commands',
            UseEmbeddedActivities: 'Use Activities',
            UseExternalApps: 'Use External Apps',
            UseExternalEmojis: 'Use External Emojis',
            UseExternalSounds: 'Use External Sounds',
            UseExternalStickers: 'Use External Stickers',
            UseSoundboard: 'Use Soundboard',
            UseVAD: 'Use Voice Activity Detection',
            ViewAuditLog: 'View Audit Log',
            ViewChannels: 'View Channel',
            ViewCreatorMonetizationAnalytics: 'View Creator Monetization Analytics', // ! Might not be a valid guild permission.
            ViewGuildInsights: 'View Server Insights'
        };
    }

    // *******************************************************
    // The rest of the functions below is just regex checking.
    // *******************************************************

    /**
     * Matches a regular expression with a string.
     * @param {RegExp} regex The regex to parse.
     * @param {string} string The string to match with the regex.
     * @returns {boolean|undefined}
     */
    static #matchRegex (regex, string) {
        return new RegExp(regex, 'g').test(string) ?? undefined;
    }

    /**
     * Checks whether the string contains a URL.
     * @param {string} string
     * @returns {boolean|undefined}
     */
    static hasURL (string) {
        const urlPattern = /(mailto|news|tel(net)?|urn|ldap|ftp|https?):\+?(\/\/)?\[?([a-zA-Z0-9]\]?.{0,})/gmi;
        return this.#matchRegex(urlPattern, string);
    }

    /**
     * Checks whether the URL contains a file extension. This function can
     * also be used to check if the URL is a valid attachment uploaded to
     * Discord's CDN.
     *
     * @param {string} url
     * @returns {boolean|undefined}
     */
    static hasExt (url) {
        const extPattern = /\.[a-zA-Z0-9]{1,5}$/i;
        return this.#matchRegex(extPattern, url) || url.includes('cdn.discord');
    }

    /**
     * Checks whether the URL provided leads to pornographic content.
     * @param {string} url The URL to parse.
     * @returns {boolean|undefined}
     */
    static pornPattern = (url) => {
        const pornSites = [
            'pornhub',
            'xhamster',
            'xvideos',
            'porntube',
            'xtube',
            'youporn',
            'pornerbros',
            'pornhd',
            'pornotube',
            'pornovoisines',
            'pornoxo'
        ];
        // eslint-disable-next-line no-useless-escape
        const pornPattern = `https?:\\/\\/(www\\.)?(${pornSites.join('|')})\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&\\/\\/=]*)`;
        return this.#matchRegex(pornPattern, url);
    };
}

module.exports = ChadUtils;
