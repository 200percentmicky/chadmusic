/// ChadMusic - The Chad Music Bot
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
const { Client, GuildMember, BaseGuildVoiceChannel, PermissionsBitField, Message, BaseGuildTextChannel, Team } = require('discord.js');
const { CommandContext } = require('slash-create');
const CMError = require('./CMError.js');
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

    /**
     * Sets the status for the connected voice channel.
     *
     * ⚠ **Experimental:** Uses an undocumented endpoint in Discord's API
     * and might change in the future.
     *
     * @param {BaseGuildVoiceChannel} vc Guild based voice channel.
     * @param {string|null} status The new status to set.
     * @param {string|null} reason The reason for the change.
     */
    static async setVcStatus (vc, status = null, reason = null) {
        vc.client.settings.ensure(vc.guild.id, vc.client.defaultSettings);
        const songVcStatus = vc.client.settings.get(vc.guild.id, 'songVcStatus');
        if (songVcStatus !== true) return;

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
     * Attempts to execute a standard prefix command from a CommandContext.
     *
     * @param {Client} client Discord client.
     * @param {CommandContext} ctx The message object or an instance of `CommandContext`.
     * @param {string} commandName The name of the command.
     * @param {Object} args Arguments to pass to the command.
     * @returns The execution of the prefix command.
     * @throws Command not found.
     */
    static async runPrefixCommand (client, ctx, commandName, args = {}) {
        if (!ctx.deferred) {
            throw new CMError('NOT_DEFERRED', null, 'Interaction must be deferred.');
        }

        const guild = await client.guilds.fetch(ctx.guildID);
        const member = await guild.members.fetch(ctx.user.id);
        const channel = await guild.channels.fetch(ctx.channelID);
        const message = await ctx.fetch().then(m => { channel.messages.fetch(m.id); });

        message.author = member.user;
        message.react = (emoji) => {
            return ctx.send(emoji, { ephemeral: true });
        };

        try {
            const command = await client.commands.findCommand(commandName);
            return client.commands.runCommand(message, command, args);
        } catch (err) {
            throw new CMError('COMMAND_ERROR', null, `Error finding or running ${commandName}: ${err}`);
        }
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
        return new RegExp(regex).test(string) ?? undefined;
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

    static isYouTubeLink (requested) {
        // eslint-disable-next-line no-useless-escape
        const ytPattern = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed|shorts\/|v\/)?)([\w\-]+)(\S+)?$/gm;
        return this.#matchRegex(ytPattern, requested);
    }

    /**
     * Checks whether the URL provided leads to pornographic content.
     * @param {string} url The URL to parse.
     * @returns {boolean|undefined}
     */
    static pornPattern = (url) => {
        // ! TODO: Come up with a better regex lol
        // eslint-disable-next-line no-useless-escape
        const pornPattern = /https?:\/\/(www\.)?(pornhub|xhamster|xvideos|porntube|xtube|youporn|pornerbros|pornhd|pornotube|pornovoisines|pornoxo)\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/g;
        return this.#matchRegex(pornPattern, url);
    };
}

module.exports = ChadUtils;
