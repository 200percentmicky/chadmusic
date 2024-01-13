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

const { Command } = require('discord-akairo');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');

module.exports = class CommandPlaylistPurge extends Command {
    constructor () {
        super('playlist-purge', {
            aliases: ['playlist-purge', 'plpurge'],
            description: {
                text: 'Deletes all playlists on the server.'
            },
            category: '📜 Playlists',
            userPermissions: PermissionFlagsBits.Administrator
        });
    }

    async exec (message) {
        if (!this.client.utils.isDJ(message.channel, message.member)) {
            return this.client.ui.sendPrompt(message, 'NO_DJ');
        }

        await this.client.playlists.ensure(message.guild.id, {});

        const yesButton = new ButtonBuilder()
            .setStyle(ButtonStyle.Success)
            .setLabel('Yes')
            .setEmoji('✔')
            .setCustomId('yes_playlist_purge');

        const noButton = new ButtonBuilder()
            .setStyle(ButtonStyle.Danger)
            .setLabel('No')
            .setEmoji('✖')
            .setCustomId('no_playlist_purge');

        const buttonRow = new ActionRowBuilder().addComponents(yesButton, noButton);

        const msg = await this.client.ui.reply(message, 'warn', 'Are you sure you want to delete all playlists for this server? This action cannot be undone!', 'Deleting All Playlists', null, null, [buttonRow]);

        const collector = await msg.createMessageComponentCollector({
            time: 30000
        });

        collector.on('collect', async interaction => {
            if (interaction.user.id !== message.member.user.id) {
                await interaction.deferReply({ ephemeral: true });
                return this.client.ui.reply(message, 'no', 'That component can only be used by the user that ran this command.');
            }

            if (interaction.customId === 'yes_playlist_purge') {
                try {
                    await this.client.playlists.delete(message.guild.id);
                    await collector.stop();
                    return this.client.ui.reply(message, 'ok', 'All playlists on the server have been deleted.');
                } catch (err) {
                    this.client.ui.reply(message, 'error', `Unable to delete all playlists. ${err.message}`);
                }
            }

            if (interaction.customId === 'no_playlist_purge') {
                await collector.stop();
                return message.react(process.env.REACTION_OK ?? '✅').catch(() => {});
            }
        });

        collector.on('end', async () => {
            await msg.delete();
        });
    }
};
