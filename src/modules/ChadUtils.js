/// ChadMusic - The Chad Music Bot
/// Copyright (C) 2024  Micky | 200percentmicky
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
const { Client, GuildMember, BaseGuildVoiceChannel, PermissionsBitField, Message } = require('discord.js');
const { CommandContext } = require('slash-create');
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
     * Checks if a user is a DJ in a guild.
     * @param {BaseGuildTextChannel} channel A text channel.
     * @param {GuildMember} member The guild member to check for DJ permissions.
     * @returns {boolean}
     */
    static isDJ (channel, member) {
        const djRole = channel.client.settings.get(channel.guild.id, 'djRole');
        const permission = member.roles.cache.has(djRole) ||
            channel.permissionsFor(member.user.id).has(PermissionsBitField.Flags.ManageChannels) ||
            member.user.id === process.env.OWNER_ID;

        return permission;
    }

    /**
     * Attempts to execute a standard prefix command.
     *
     * @param {Message|CommandContext} message The message object or an instance of `CommandContext`.
     * @param {string} commandName The name of the command.
     * @param {Object} args Arguments to pass to the command.
     * @returns The execution of the prefix command.
     * @throws Command not found.
     */
    static async runPrefixCommand (message, commandName, args) {
        try {
            const command = await message.channel.client.commands.findCommand(commandName);
            return command.exec(message, args);
        } catch {
            throw new Error(`Command ${commandName} not found.`);
        }
    }

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
     * Checks whether the string contains a file extension.
     * @param {string} string
     * @returns {boolean|undefined}
     */
    static hasExt (string) {
        const extPattern = /\.[a-zA-Z0-9]{1,5}$/i;
        return this.#matchRegex(extPattern, string);
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
