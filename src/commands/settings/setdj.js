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
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require('discord.js');

module.exports = class CommandSetDJ extends Command {
    constructor () {
        super('setdj', {
            aliases: ['setdj'],
            category: '⚙ Settings',
            description: {
                text: 'Sets the DJ Role for this server.',
                usage: '[role:none/off]',
                details: '`[role:none/off]` The role you would like to set. Can be the name, the ID, or a mention of the role.'
            },
            userPermissions: [PermissionsBitField.Flags.ManageGuild],
            args: [
                {
                    id: 'role',
                    match: 'rest'
                }
            ]
        });
    }

    async exec (message, args) {
        if (!args.role) {
            await this.client.settings.delete(message.guild.id, 'djRole');
            return this.client.ui.reply(message, 'ok', 'The DJ role has been removed.');
        }

        const role = message.mentions.roles.first() ||
            message.guild.roles.cache.get(args.role) ||
            message.guild.roles.cache.find(val => val.name === args.role);

        const setDjRole = async (role) => {
            if (!role) return this.client.ui.reply(message, 'error', `\`${role}\` is not a valid role.`);

            await this.client.settings.set(message.guild.id, role.id, 'djRole');
            return this.client.ui.reply(message, 'ok', `<@&${role.id}> has been set as the DJ Role.`);
        };

        if (role.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            const yesButton = new ButtonBuilder()
                .setStyle(ButtonStyle.Success)
                .setLabel('Yes')
                .setEmoji('✔')
                .setCustomId('yes_dj_role');

            const noButton = new ButtonBuilder()
                .setStyle(ButtonStyle.Danger)
                .setLabel('No')
                .setEmoji('✖')
                .setCustomId('no_dj_role');

            const buttonRow = new ActionRowBuilder().addComponents(yesButton, noButton);

            const msg = await this.client.ui.reply(
                message,
                'info',
                stripIndents`
                The role you selected is already recognized as a DJ role on this server.
                This is because the role has the **Manage Channels** permission which
                automatically grants DJ permissions for members with this role. Do you
                still want to set this role as the DJ role on this server?`,
                null,
                null,
                null,
                [buttonRow]
            );

            const collector = await msg.createMessageComponentCollector({
                time: 60 * 1000
            });

            collector.on('collect', async interaction => {
                if (interaction.user.id !== message.member.user.id) {
                    return this.client.ui.reply(interaction, 'no', 'That component can only be used by the user that ran this command.');
                }

                if (interaction.customId === 'yes_dj_role') {
                    collector.stop();
                    await setDjRole(role);
                }

                if (interaction.customId === 'no_dj_role') {
                    collector.stop();
                }
            });

            collector.on('end', async () => {
                await msg.delete();
            });
        } else {
            return setDjRole(role);
        }
    }
};
