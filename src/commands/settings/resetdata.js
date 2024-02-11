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

const { Command } = require('discord-akairo');
const { ButtonBuilder, ActionRowBuilder, EmbedBuilder, PermissionsBitField, ButtonStyle } = require('discord.js');

module.exports = class CommandResetData extends Command {
    constructor () {
        super('resetdata', {
            aliases: ['resetdata'],
            category: '⚙ Settings',
            description: {
                text: 'Allows you to reset the bot\'s music settings for this server.'
            },
            channel: 'guild',
            userPermissions: [PermissionsBitField.Flags.Administrator]
        });
    }

    async exec (message) {
        const yesButton = new ButtonBuilder()
            .setStyle(ButtonStyle.Success)
            .setLabel('Yes')
            .setEmoji('✔')
            .setCustomId('yes_data');

        const noButton = new ButtonBuilder()
            .setStyle(ButtonStyle.Danger)
            .setLabel('No')
            .setEmoji('✖')
            .setCustomId('no_data');

        const buttonRow = new ActionRowBuilder().addComponents(yesButton, noButton);

        const msg = await this.client.ui.reply(message, 'warn', 'You are about to revert the bot\'s settings for this server to the default settings. Are you sure you want to do this?', 'Warning', null, null, [buttonRow]);

        const collector = await msg.createMessageComponentCollector({
            time: 30000
        });

        collector.on('collect', async interaction => {
            if (interaction.user.id !== message.member.user.id) {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(process.env.COLOR_NO)
                            .setDescription(`${process.env.EMOJI_NO} That component can only be used by the user that ran this command.`)
                    ],
                    ephemeral: true
                });
            }

            if (interaction.customId === 'yes_data') {
                await this.client.settings.delete(interaction.guild.id);
                await this.client.settings.ensure(interaction.guild.id, this.client.defaultSettings);
                collector.stop();
                return this.client.ui.reply(message, 'ok', 'The settings for this server have been cleared.');
            }

            if (interaction.customId === 'no_data') {
                collector.stop();
            }
        });

        collector.on('end', async () => {
            await msg.delete();
        });
    }
};
