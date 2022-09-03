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

/* eslint-disable no-var */
const { Command } = require('discord-akairo');
const { EmbedBuilder, ChannelType, PermissionsBitField } = require('discord.js');

module.exports = class CommandHelp extends Command {
    constructor () {
        super('help', {
            aliases: ['help'],
            description: {
                text: 'You\'re looking at it! Displays info about available commands.',
                usage: '[command]',
                details: '`[command]` The command you want to know more about. Shows you how to use its syntax and what permissions it requires to operate.'
            },
            category: '💻 Core',
            args: [
                {
                    type: 'string',
                    id: 'command',
                    match: 'content',
                    default: null
                }
            ],
            clientPermissions: PermissionsBitField.Flags.EmbedLinks
        });
    }

    async exec (message, args) {
        const cmdName = args.command;
        const command = this.handler.modules.get(cmdName);

        let prefix;
        if (message.channel.type === ChannelType.DM) {
            prefix = this.client.prefix.getPrefix(message.guild.id)
                ? this.client.prefix.getPrefix(message.guild.id)
                : process.env.PREFIX;
        } else {
            prefix = process.env.PREFIX;
        }

        if (cmdName) {
            // The command has been found.
            if (this.handler.modules.has(cmdName)) {
                const permissions = {
                    CREATE_INSTANT_INVITE: 'Create Instant Invite',
                    KICK_MEMBERS: 'Kick Members',
                    BAN_MEMBERS: 'Ban Members',
                    ADMINISTRATOR: 'Administrator',
                    MANAGE_CHANNELS: 'Manage Channels',
                    MANAGE_GUILD: 'Manage Server',
                    ADD_REACTIONS: 'Add Reactions',
                    VIEW_AUDIT_LOG: 'View Audit Log',
                    PRIORITY_SPEAKER: 'Priority Speaker',
                    STREAM: 'Video',
                    VIEW_CHANNEL: 'Read Messages',
                    SEND_MESSAGES: 'Send Messages',
                    SEND_TTS_MESSAGES: 'Send TTS Messages',
                    MANAGE_MESSAGES: 'Manage Messages',
                    EMBED_LINKS: 'Embed Links',
                    ATTACH_FILES: 'Attach Files',
                    READ_MESSAGE_HISTORY: 'Read Message History',
                    MENTION_EVERYONE: 'MENTION_EVERYONE',
                    USE_EXTERNAL_EMOJIS: 'Use External Emojis',
                    VIEW_GUILD_INSIGHTS: 'View Server Insights',
                    CONNECT: 'Connect',
                    SPEAK: 'Speak',
                    MUTE_MEMBERS: 'Mute Members',
                    DEAFEN_MEMBERS: 'Deafen Members',
                    MOVE_MEMBERS: 'Move Members',
                    USE_VAD: 'Use Voice Activity Detection',
                    CHANGE_NICKNAME: 'Change Nickname',
                    MANAGE_NICKNAMES: 'Manage Nicknames',
                    MANAGE_ROLES: 'Manage Roles',
                    MANAGE_WEBHOOKS: 'Manage Webhooks',
                    MANAGE_EMOJIS: 'Manage Emojis'
                };

                const commandEmbed = new EmbedBuilder()
                    .setColor(message.guild.members.me.displayColor !== 0 ? message.guild.members.me.displayColor : null)
                    .setAuthor({
                        name: 'ChadMusic - The Chad Music Bot',
                        iconURL: this.client.user.avatarURL({ dynamic: true })
                    })
                    .setTitle(`\`${prefix}${command.id}${command.description.usage ? ` ${command.description.usage}` : ''}\``)
                    .setTimestamp()
                    .setFooter({
                        text: '<Required> • [Optional]',
                        iconURL: message.author.avatarURL({ dynamic: true })
                    });

                const commandFields = [];

                commandFields.push({
                    name: `${command.description.text}`,
                    value: `${command.description.details ? command.description.details : '\u200b'}`
                });

                if (command.ownerOnly) commandFields.push({ name: '🚫 Owner Only', value: 'This command is for the bot owner only.' });
                if (command.category === '🔞 NSFW') commandFields.push({ name: '🔞 NSFW Command', value: 'This command must be used in a NSFW channel.' });
                if (command.category) {
                    commandFields.push({
                        name: 'Category',
                        value: `${command.category}`,
                        inline: true
                    });
                }
                // if (command.description.details) commandEmbed.addField('Details', `\`\`\`js\n${command.description.details}\`\`\``);
                if (command.aliases.length > 1) commandFields.push({ name: 'Aliases', value: `${command.aliases}`, inline: true });

                // This gonna be a bruh moment.
                // It do be Yandere Simulator lol
                if (command.userPermissions) var userPerms = await command.userPermissions.map(user => permissions[user]).join(', ');
                if (command.clientPermissions) var clientPerms = await command.clientPermissions.map(client => permissions[client]).join(', ');
                const _uPerms = command.userPermissions ? `**User:** ${userPerms}\n` : '';
                const _bPerms = command.clientPermissions ? `**Bot:** ${clientPerms}` : '';
                if (userPerms || clientPerms) commandFields.push({ name: 'Permissions', value: `${_uPerms}${_bPerms}` });

                /*
        if (command.clientPermissions) {
          const clientPerms = await command.clientPermissions.map(client => permissions[client]).join(', ');
          commandEmbed.addField('Bot Permissions', clientPerms, true);
        } */
                commandEmbed.addFields(commandFields);

                return message.channel.send({ embeds: [commandEmbed] });
            } else return;
        }

        const helpEmbed = new EmbedBuilder()
            .setColor(message.guild.members.me.displayColor !== 0 ? message.guild.members.me.displayColor : null)
            .setAuthor({
                name: 'ChadMusic - The Chad Music Bot',
                iconURL: this.client.user.avatarURL({ dynamic: true })
            })
            .setTimestamp()
            .setFooter({
                text: `To learn more about a command, use ${prefix}help [command]`
            });

        this.handler.categories.forEach((value, key) => {
            const helpFields = [];
            const field = {
                name: key,
                value: ''
            };
            value.forEach((commands) => {
                field.value += `\`${commands.id}\` `;
            });
            field.value = `${field.value}`;
            helpFields.push(field);
            helpEmbed.addFields(helpFields);
        });
        return message.channel.send({ embeds: [helpEmbed] });
    }
};
