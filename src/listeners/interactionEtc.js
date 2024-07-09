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

const { Listener } = require('discord-akairo');
const { EmbedBuilder } = require('discord.js');

// Handles various interaction requests not needed within the commands.

module.exports = class ListenerInteractionEtc extends Listener {
    constructor () {
        super('interactionEtc', {
            emitter: 'client',
            event: 'interactionCreate'
        });
    }

    async exec (interaction) {
        switch (interaction.customId) {
        case 'close_eval': {
            await interaction.deferUpdate();
            if (interaction.user.id !== this.client.owner?.id) {
                return interaction.followUp({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(process.env.COLOR_ERROR)
                            .setDescription(`${process.env.EMOJI_ERROR} This component can only be used by the bot owner.`)
                    ],
                    ephemeral: true
                });
            }
            interaction.message.delete();
            break;
        }
        }
    }
};
