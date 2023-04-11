/**
 *  ChadMusic - The Chad Music Bot
 *  Copyright (C) 2023  Micky D. | @200percentmicky | Micky-kun#3836
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
                /* eslint-disable quote-props */
                // Just so you know, they're being converted to BigInt.
                const permissionsBits = {
                    '64': 'Add Reactions',
                    '8': 'Administrator',
                    '32768': 'Attach Files',
                    '4': 'Ban Members',
                    '67108864': 'Change Nickname',
                    '1048576': 'Connect',
                    '1': 'Create Instant Invite',
                    '68719476736': 'Create Private Threads',
                    '34359738368': 'Create Public Threads',
                    '8388608': 'Deafen Members',
                    '16384': 'Embed Links',
                    '2': 'Kick Members',
                    '16': 'Manage Channels',
                    '1073741824': 'Manage Emojis and Stickers',
                    '8589934592': 'Manage Events',
                    '32': 'Manage Server',
                    '8192': 'Manage Messages',
                    '134217728': 'Manage Nicknames',
                    '268435456': 'Manage Roles',
                    '17179869184': 'Manage Threads',
                    '536870912': 'Manage Webhooks',
                    '131072': 'Mention Everyone, Here, and All Roles',
                    '1099511627776': 'Moderate Members',
                    '16777216': 'Move Members',
                    '4194304': 'Mute Members',
                    '256': 'Priority Speaker',
                    '65536': 'Read Message History',
                    '4294967296': 'Request to Speak',
                    '2048': 'Send Messages',
                    '274877906944': 'Send Messages in Threads',
                    '4096': 'Send Text-To-Speech Messages',
                    '2097152': 'Speak',
                    '512': 'Stream',
                    '2147483648': 'Use Application Commands',
                    '549755813888': 'Use Embedded Activities',
                    '262144': 'Use External Emojis',
                    '137438953472': 'Use External Stickers',
                    '33554432': 'Use Voice Activity Detection',
                    '128': 'View Audit Log',
                    '1024': 'View Channel',
                    '524288': 'View Guild Insights'
                };

                const commandEmbed = new EmbedBuilder()
                    .setColor(message.guild.members.me.displayColor !== 0 ? message.guild.members.me.displayColor : null)
                    .setAuthor({
                        name: 'ChadMusic - The Chad Music Bot',
                        iconURL: this.client.user.avatarURL({ dynamic: true })
                    })
                    .setTitle(`\`${prefix}${command.id}${command.description.usage ? ` ${command.description.usage}` : ''}\``)
                    .setDescription(`**${command.description.text}**\n${command.description.details ?? ''}`)
                    .setTimestamp()
                    .setFooter({
                        text: '<Required> • [Optional]',
                        iconURL: message.member.user.avatarURL({ dynamic: true })
                    });

                const commandFields = [];

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
                if (command.aliases.length > 1) commandFields.push({ name: 'Aliases', value: `${command.aliases.join('\n')}`, inline: true });

                // This gonna be a bruh moment.
                // It do be Yandere Simulator lol
                let userPerms = permissionsBits[command.userPermissions];
                let clientPerms = permissionsBits[command.clientPermissions];

                if (command.userPermissions instanceof Array) {
                    userPerms = command.userPermissions.map(user => permissionsBits[BigInt(user)]).join(', ');
                }

                if (command.clientPermissions instanceof Array) {
                    clientPerms = command.clientPermissions.map(client => permissionsBits[BigInt(client)]).join(', ');
                }

                const _uPerms = command.userPermissions ? `**User:** ${userPerms}\n` : '';
                const _bPerms = command.clientPermissions ? `**Bot:** ${clientPerms}` : '';
                if (userPerms || clientPerms) commandFields.push({ name: 'Permissions', value: `${_uPerms}${_bPerms}` });

                /*
        if (command.clientPermissions) {
          const clientPerms = await command.clientPermissions.map(client => permissions[client]).join(', ');
          commandEmbed.addField('Bot Permissions', clientPerms, true);
        } */
                commandEmbed.addFields(commandFields);

                return message.reply({ embeds: [commandEmbed] });
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
        return message.reply({ embeds: [helpEmbed] });
    }
};
