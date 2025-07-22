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

const { stripIndents } = require('common-tags');
const { Command } = require('discord-akairo');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = class CommandBlocksong extends Command {
    constructor () {
        super('blocksong', {
            aliases: ['blocksong'],
            category: '⚙ Settings',
            description: {
                text: 'Manages the server\'s list of blocked search phrases.',
                usage: '<add/remove/list> <phrase>',
                details: stripIndents`
                **Subcommands**
                \`add\` Adds a phrase to the list.
                \`remove\` Removes a phrase from the list.
                \`list\` View the current list for the server.

                **Arguments**
                \`<phrase>\` The phrase to add or remove from the list.
                `
            },
            userPermissions: [PermissionsBitField.Flags.ManageGuild],
            args: [
                {
                    id: 'subcommand',
                    type: 'string'
                },
                {
                    id: 'phrase',
                    match: 'rest'
                }
            ]
        });
    }

    async exec (message, args) {
        switch (args.subcommand) {
        case 'add': {
            if (!args.phrase) return this.client.ui.usage(message, 'blocksong <add/remove/list> <phrase>');
            if (this.client.settings.includes(message.guild.id, args.phrase, 'blockedPhrases')) {
                return this.client.ui.reply(message, 'warn', `\`${args.phrase}\` doesn't exist in the list.`);
            }

            await this.client.settings.push(message.guild.id, args.phrase, 'blockedPhrases');
            this.client.ui.reply(message, 'ok', `\`${args.phrase}\` is now blocked on this server.`, null, 'Any phrases in the list will no longer be added to the player.');
            break;
        }

        case 'remove': {
            if (!args.phrase) return this.client.ui.usage(message, 'blocksong <add/remove/list> <phrase>');
            if (!this.client.settings.includes(message.guild.id, args.phrase, 'blockedPhrases')) {
                return this.client.ui.reply(message, 'warn', `\`${args.phrase}\` doesn't exist in the list.`);
            }

            await this.client.settings.remove(message.guild.id, args.phrase, 'blockedPhrases');
            this.client.ui.reply(message, 'ok', `\`${args.phrase}\` is no longer blocked on this server.`);
            break;
        }

        case 'list': {
            const blockedPhrases = this.client.settings.get(message.guild.id, 'blockedPhrases'); // Blocked Songs

            const blockedEmbed = new EmbedBuilder()
                .setColor(message.guild.members.me.displayColor !== 0 ? message.guild.members.me.displayColor : null)
                .setAuthor({
                    name: `${message.guild.name}`,
                    iconURL: message.guild.iconURL({ dynamic: true })
                })
                .setDescription(`\`\`\`${blockedPhrases.join(', ')}\`\`\``)
                .setTitle(':notes::x: Blocked Songs')
                .setTimestamp()
                .setFooter({
                    text: `ChadMusic v${this.client.version}`,
                    iconURL: 'https://media.discordapp.net/attachments/375453081631981568/808626634210410506/deejaytreefiddy.png'
                });

            if (blockedPhrases.length === 0) {
                blockedEmbed.setDescription(null);
                blockedEmbed.addFields({
                    name: `${process.env.EMOJI_INFO} No song phrases are being blocked in this server.`,
                    value: `To add phrases to the list, run \`${process.env.PREFIX}blocksong add <phrase>\`.`
                });
            }

            try {
                await message.member.user.send({ embeds: [blockedEmbed] });
                return message.react(process.env.REACTION_CUTIE ?? '🎶');
            } catch {
                return this.client.ui.reply(message, 'error', 'You must be accepting Direct Messages to receive the blocked song list. Alternatively, you can run `/settings blocksong list` to get the list instead.');
            }
        }

        default: {
            this.client.ui.usage(message, 'blocksong <add/remove> <phrase>');
        }
        }
    }
};
