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
const {
    EmbedBuilder,
    ButtonBuilder,
    ActionRowBuilder,
    TextInputBuilder,
    PermissionsBitField,
    TextInputStyle,
    ButtonStyle,
    ComponentType,
    ModalBuilder
} = require('discord.js');
const { Paginator } = require('array-paginator');
const { toColonNotation } = require('colon-notation');
const { isSameVoiceChannel } = require('../../modules/isSameVoiceChannel');
// const { FieldsEmbed } = require('discord-paginationembed')

// TODO: Use Discord Embed Buttons to go to the next page.

module.exports = class CommandQueue extends Command {
    constructor () {
        super('queue', {
            aliases: ['queue', 'q'],
            category: '🎶 Music',
            description: {
                text: 'View the queue for this server.'
            },
            channel: 'guild',
            clientPermissions: PermissionsBitField.Flags.EmbedLinks
        });
    }

    async exec (message) {
        const djMode = this.client.settings.get(message.guild.id, 'djMode');
        const djRole = this.client.settings.get(message.guild.id, 'djRole');
        const dj = message.member.roles.cache.has(djRole) || message.channel.permissionsFor(message.member.user.id).has(PermissionsBitField.Flags.ManageChannels);
        if (djMode) {
            if (!dj) return this.client.ui.sendPrompt(message, 'DJ_MODE');
        }

        const textChannel = this.client.settings.get(message.guild.id, 'textChannel', null);
        if (textChannel) {
            if (textChannel !== message.channel.id) {
                return this.client.ui.sendPrompt(message, 'WRONG_TEXT_CHANNEL_MUSIC', textChannel);
            }
        }

        const queue = this.client.player.getQueue(message);
        const vc = message.member.voice.channel;

        if (!vc) return this.client.ui.sendPrompt(message, 'NOT_IN_VC');

        const currentVc = this.client.vc.get(vc);

        if (!this.client.player.getQueue(message) || !currentVc) return this.client.ui.sendPrompt(message, 'NOT_PLAYING');
        else if (!isSameVoiceChannel(this.client, message.member, vc)) return this.client.ui.sendPrompt(message, 'ALREADY_SUMMONED_ELSEWHERE');

        /* Getting the entire queue. */
        const songs = queue.songs.slice(1);
        const song = queue.songs[0];

        /* Create a paginated array. */
        const queuePaginate = new Paginator(songs, 10);

        /* Get the page of the array. */
        const paginateArray = queuePaginate.page(1);

        // This includes the currently playing song btw...
        const numOfHiddenEntries = songs.filter(x => x.metadata.silent).length;
        const numOfEntries = songs.length > 0 ? `${songs.length} entr${queue.songs.length === 1 ? 'y' : 'ies'} (${numOfHiddenEntries} hidden)` : '';
        const trueTime = songs.map(x => x.duration).reduce((a, b) => a + b, 0);
        const totalTime = songs.length > 0 ? ` • Total Length: \`${trueTime ? toColonNotation(parseInt(trueTime + '000')) : '00:00'}\`` : '';

        // For tracks added silently...
        const songEntry = (song) => {
            return song.metadata?.silent
                ? '🔇 This track is hidden.'
                : `${song.user} \`${song.formattedDuration}\` [${song.name}](${song.url})`;
        };

        /* Map the array. */
        const queueMap = songs.length > 0
            ? paginateArray.map(song => `**${songs.indexOf(song) + 1}:** ${songEntry(song)}`).join('\n\n')
            : `${process.env.EMOJI_WARN} The queue is empty. Start adding some songs!`;

        /* Making the embed. */
        const queueEmbed = new EmbedBuilder()
            .setColor(message.guild.members.me.displayColor !== 0 ? message.guild.members.me.displayColor : null)
            .setAuthor({
                name: `Queue for ${message.guild.name} - ${currentVc.channel.name}`,
                iconURL: message.guild.iconURL({ dynamic: true })
            })
            .setDescription(`${queueMap}${songs.length > 0 ? `\n\n${numOfEntries}${totalTime}` : ''}`)
            .addFields({
                name: `${process.env.EMOJI_MUSIC} Currently Playing`,
                value: songEntry(song)
            })
            .setTimestamp()
            .setFooter({
                text: `${songs.length > 0 ? `Page ${queuePaginate.current} of ${queuePaginate.total}` : 'Queue is empty.'}`,
                iconURL: message.member.user.avatarURL({ dynamic: true })
            });

        /* Creating the buttons to interact with the queue. */

        // First Page
        const firstPage = new ButtonBuilder()
            .setStyle(ButtonStyle.Primary)
            .setEmoji(process.env.FIRST_PAGE)
            .setCustomId('first_page')
            .setDisabled(true); // Since the embed opens on the first page.

        // Previous Page
        const previousPage = new ButtonBuilder()
            .setStyle(ButtonStyle.Primary)
            .setEmoji(process.env.PREVIOUS_PAGE)
            .setCustomId('previous_page')
            .setDisabled(true); // Since the embed opens on the first page.

        // Next Page
        const nextPage = new ButtonBuilder()
            .setStyle(ButtonStyle.Primary)
            .setEmoji(process.env.NEXT_PAGE)
            .setCustomId('next_page');

        // Last Page
        const lastPage = new ButtonBuilder()
            .setStyle(ButtonStyle.Primary)
            .setEmoji(process.env.LAST_PAGE)
            .setCustomId('last_page');

        // Jump to Page
        const pageJump = new ButtonBuilder()
            .setStyle(ButtonStyle.Primary)
            .setEmoji(process.env.JUMP_PAGE)
            .setCustomId('page_jump');

        // Cancel
        const cancelButton = new ButtonBuilder()
            .setStyle(ButtonStyle.Danger)
            .setEmoji(process.env.CLOSE)
            .setCustomId('close_queue');

        /* Row of buttons! */
        const buttonRow = new ActionRowBuilder()
            .addComponents(firstPage, previousPage, nextPage, lastPage, pageJump);

        /* Ran out of room for the cancel button, so... */
        const cancelRow = new ActionRowBuilder()
            .addComponents(cancelButton);

        const components = songs.length === 0 || songs.length <= 10 ? [cancelRow] : [buttonRow, cancelRow];

        /* Finally send the embed of the queue. */
        const msg = await message.reply({ embeds: [queueEmbed], components: components, allowedMentions: { repliedUser: false } });

        /* Button Collector */
        const collector = await msg.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 1000 * 60 * 15
        });

        // TODO: Look into combining the collector into a single function.

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

            const managePage = async (interaction, queuePage) => {
                const paginateArray = queuePage;

                /* Map the array. */
                const queueMap = paginateArray.map(song => `**${songs.indexOf(song) + 1}:** ${songEntry(song)}`).join('\n\n');

                /* Need to make sure all buttons are available */
                nextPage.setDisabled(false);
                lastPage.setDisabled(false);
                firstPage.setDisabled(false);
                previousPage.setDisabled(false);

                // No previous page.
                if (!queuePaginate.hasPrevious()) {
                    firstPage.setDisabled(true);
                    previousPage.setDisabled(true);
                }

                // No next page.
                if (!queuePaginate.hasNext()) {
                    nextPage.setDisabled(true);
                    lastPage.setDisabled(true);
                }

                /* Row of buttons! */
                const buttonRow = new ActionRowBuilder()
                    .addComponents(firstPage, previousPage, nextPage, lastPage, pageJump);

                /* Rand out of room for the cancel button, so... */
                const cancelRow = new ActionRowBuilder()
                    .addComponents(cancelButton);

                const components = songs.length === 0 || songs.length <= 10 ? [cancelRow] : [buttonRow, cancelRow];

                /* Making the embed. */
                queueEmbed.setDescription(`${queueMap}${songs.length > 0 ? `\n\n${numOfEntries}${totalTime}` : ''}`);
                queueEmbed.setFooter({
                    text: `${queue ? `Page ${queuePaginate.current} of ${queuePaginate.total}` : 'Queue is empty.'}`,
                    iconURL: message.member.user.avatarURL({ dynamic: true })
                });

                await interaction.update({ embeds: [queueEmbed], components: components, allowedMentions: { repliedUser: false } });
            };

            // First Page Button
            if (interaction.customId === 'first_page') {
                await managePage(interaction, queuePaginate.first());
            }

            // Previous Page Button
            if (interaction.customId === 'previous_page') {
                await managePage(interaction, queuePaginate.previous());
            }

            // Next Page Button
            if (interaction.customId === 'next_page') {
                await managePage(interaction, queuePaginate.next());
            }

            // Last Page Button
            if (interaction.customId === 'last_page') {
                await managePage(interaction, queuePaginate.last());
            }

            // Jump to Page Button
            if (interaction.customId === 'page_jump') {
                const modal = new ModalBuilder()
                    .setCustomId('modal_jump_page_msg')
                    .setTitle('Select Page')
                    .addComponents(
                        new ActionRowBuilder()
                            .addComponents(
                                new TextInputBuilder()
                                    .setCustomId('modal_jump_page_msg_short')
                                    .setLabel('Which page do you want to jump to?')
                                    .setMaxLength(3)
                                    .setStyle(TextInputStyle.Short)
                                    .setRequired(true)
                            )
                    );
                await interaction.showModal(modal);

                const filter = i => i.customId === 'modal_jump_page_msg';
                interaction.awaitModalSubmit({
                    filter,
                    time: 30000
                }).then(async intmodal => {
                    let pageNumber = parseInt(intmodal.fields.getTextInputValue('modal_jump_page_msg_short'));

                    if (isNaN(pageNumber)) {
                        return interaction.followUp({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(process.env.COLOR_ERROR)
                                    .setDescription(`${process.env.EMOJI_ERROR} A number must be provided in your response. Please try again.`)
                            ],
                            ephemeral: true
                        });
                    }

                    if (pageNumber >= queuePaginate.total) {
                        // Stupid fix lol
                        pageNumber = queuePaginate.totalPages;
                    } else if (pageNumber < 1) {
                        pageNumber = 1;
                    }
                    return await managePage(intmodal, queuePaginate.page(pageNumber));
                }).catch(x => {});
            }

            // Cancel Button
            if (interaction.customId === 'close_queue') {
                await interaction.deferUpdate();
                await interaction.message.delete();
                collector.stop();
                return message.react(process.env.REACTION_OK).catch(() => {});
            }
        });

        collector.on('end', async () => {
            await msg.edit({ components: [] });
        });
    }
};
