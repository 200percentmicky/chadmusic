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

const { Command } = require('discord-akairo');
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const { Paginator } = require('array-paginator');
const { toColonNotation } = require('colon-notation');
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
            clientPermissions: ['EMBED_LINKS']
        });
    }

    async exec (message) {
        const djMode = this.client.settings.get(message.guild.id, 'djMode');
        const djRole = this.client.settings.get(message.guild.id, 'djRole');
        const dj = message.member.roles.cache.has(djRole) || message.channel.permissionsFor(message.member.user.id).has(['MANAGE_CHANNELS']);
        if (djMode) {
            if (!dj) return this.client.ui.send(message, 'DJ_MODE');
        }

        const textChannel = this.client.settings.get(message.guild.id, 'textChannel', null);
        if (textChannel) {
            if (textChannel !== message.channel.id) {
                return this.client.ui.send(message, 'WRONG_TEXT_CHANNEL_MUSIC', textChannel);
            }
        }

        const queue = this.client.player.getQueue(message);
        const vc = message.member.voice.channel;

        if (!vc) return this.client.ui.send(message, 'NOT_IN_VC');

        const currentVc = this.client.vc.get(vc);

        if (!this.client.player.getQueue(message) || !currentVc) return this.client.ui.send(message, 'NOT_PLAYING');
        else if (vc.id !== currentVc.channel.id) return this.client.ui.send(message, 'ALREADY_SUMMONED_ELSEWHERE');

        /* Getting the entire queue. */
        const songs = queue.songs.slice(1);
        const song = queue.songs[0];

        /* Create a paginated array. */
        const queuePaginate = new Paginator(songs, 10);

        /* Get the page of the array. */
        const paginateArray = queuePaginate.page(1);

        // This includes the currently playing song btw...
        const numOfEntries = songs.length > 0 ? `${songs.length} entr${queue.songs.length === 1 ? 'y' : 'ies'}` : '';
        const trueTime = songs.map(x => x.duration).reduce((a, b) => a + b, 0);
        const totalTime = songs.length > 0 ? ` • Total Length: \`${trueTime ? toColonNotation(parseInt(trueTime + '000')) : '00:00'}\`` : '';

        /* Map the array. */
        const queueMap = songs.length > 0
            ? paginateArray.map(song => `**${songs.indexOf(song) + 1}:** ${song.user} \`${song.formattedDuration}\` [${song.name}](${song.url})`).join('\n')
            : `${process.env.EMOJI_WARN} The queue is empty. Start adding some songs!`;

        /* Making the embed. */
        const queueEmbed = new MessageEmbed()
            .setColor(message.guild.me.displayColor !== 0 ? message.guild.me.displayColor : null)
            .setAuthor({
                name: `Queue for ${message.guild.name} - ${currentVc.channel.name}`,
                iconURL: message.guild.iconURL({ dynamic: true })
            })
            .setDescription(`${queueMap}${songs.length > 0 ? `\n\n${numOfEntries}${totalTime}` : ''}`)
            .addField(`${process.env.EMOJI_MUSIC} Currently Playing`, `**[${song.name}](${song.url})**\n${song.user} \`${song.formattedDuration}\``)
            .setTimestamp()
            .setFooter({
                text: `${songs.length > 0 ? `Page ${queuePaginate.current} of ${queuePaginate.total}` : 'Queue is empty.'}`,
                iconURL: message.author.avatarURL({ dynamic: true })
            });

        /* Creating the buttons to interact with the queue. */

        // First Page
        const firstPage = new MessageButton()
            .setStyle('PRIMARY')
            .setEmoji(process.env.FIRST_PAGE)
            .setCustomId('first_page')
            .setDisabled(true); // Since the embed opens on the first page.

        // Previous Page
        const previousPage = new MessageButton()
            .setStyle('PRIMARY')
            .setEmoji(process.env.PREVIOUS_PAGE)
            .setCustomId('previous_page')
            .setDisabled(true); // Since the embed opens on the first page.

        // Next Page
        const nextPage = new MessageButton()
            .setStyle('PRIMARY')
            .setEmoji(process.env.NEXT_PAGE)
            .setCustomId('next_page');

        // Last Page
        const lastPage = new MessageButton()
            .setStyle('PRIMARY')
            .setEmoji(process.env.LAST_PAGE)
            .setCustomId('last_page');

        // Jump to Page
        const pageJump = new MessageButton()
            .setStyle('PRIMARY')
            .setEmoji(process.env.JUMP_PAGE)
            .setCustomId('page_jump');

        // Cancel
        const cancelButton = new MessageButton()
            .setStyle('DANGER')
            .setEmoji(process.env.CLOSE)
            .setCustomId('cancel_button');

        /* Row of buttons! */
        const buttonRow = new MessageActionRow()
            .addComponents(firstPage, previousPage, nextPage, lastPage, pageJump);

        /* Ran out of room for the cancel button, so... */
        const cancelRow = new MessageActionRow()
            .addComponents(cancelButton);

        const components = songs.length === 0 || songs.length <= 10 ? [cancelRow] : [buttonRow, cancelRow];

        /* Finally send the embed of the queue. */
        const msg = await message.reply({ embeds: [queueEmbed], components: components, allowedMentions: { repliedUser: false } });

        /* Button Collector */
        const collector = await msg.createMessageComponentCollector({
            componentType: 'BUTTON',
            time: 1000 * 60 * 15
        });

        // TODO: Look into combining the collector into a single function.

        collector.on('collect', async interaction => {
            if (interaction.user.id !== message.member.user.id) {
                return interaction.reply({
                    embeds: [
                        new MessageEmbed()
                            .setColor(parseInt(process.env.COLOR_NO))
                            .setDescription(`${process.env.EMOJI_NO} That component can only be used by the user that ran this command.`)
                    ],
                    ephemeral: true
                });
            }

            // First Page Button
            if (interaction.customId === 'first_page') {
                const paginateArray = queuePaginate.first();

                /* Map the array. */
                const queueMap = paginateArray.map(song => `**${songs.indexOf(song) + 1}:** ${song.user} \`${song.formattedDuration}\` [${song.name}](${song.url})`).join('\n');

                /* Enable and disable buttons */
                nextPage.setDisabled(false);
                lastPage.setDisabled(false);
                if (!queuePaginate.hasPrevious()) {
                    firstPage.setDisabled(true);
                    previousPage.setDisabled(true);
                }
                /* Row of buttons! */
                const buttonRow = new MessageActionRow()
                    .addComponents(firstPage, previousPage, nextPage, lastPage, pageJump);

                /* Rand out of room for the cancel button, so... */
                const cancelRow = new MessageActionRow()
                    .addComponents(cancelButton);

                const components = songs.length === 0 || songs.length <= 10 ? [cancelRow] : [buttonRow, cancelRow];

                /* Making the embed. */
                queueEmbed.setDescription(`${queueMap}${songs.length > 0 ? `\n\n${numOfEntries}${totalTime}` : ''}`);
                queueEmbed.setFooter({
                    text: `${queue ? `Page ${queuePaginate.current} of ${queuePaginate.total}` : 'Queue is empty.'}`,
                    iconURL: message.author.avatarURL({ dynamic: true })
                });
                await interaction.message.edit({ embeds: [queueEmbed], components: components, allowedMentions: { repliedUser: false } });
            }

            // Previous Page Button
            if (interaction.customId === 'previous_page') {
                const paginateArray = queuePaginate.previous();

                /* Map the array. */
                const queueMap = paginateArray.map(song => `**${songs.indexOf(song) + 1}:** ${song.user} \`${song.formattedDuration}\` [${song.name}](${song.url})`).join('\n');

                /* Need to make sure all buttons are available */
                nextPage.setDisabled(false);
                lastPage.setDisabled(false);
                firstPage.setDisabled(false);
                previousPage.setDisabled(false);
                if (!queuePaginate.hasPrevious()) {
                    firstPage.setDisabled(true);
                    previousPage.setDisabled(true);
                }
                /* Row of buttons! */
                const buttonRow = new MessageActionRow()
                    .addComponents(firstPage, previousPage, nextPage, lastPage, pageJump);

                /* Rand out of room for the cancel button, so... */
                const cancelRow = new MessageActionRow()
                    .addComponents(cancelButton);

                const components = songs.length === 0 || songs.length <= 10 ? [cancelRow] : [buttonRow, cancelRow];

                /* Making the embed. */
                queueEmbed.setDescription(`${queueMap}${songs.length > 0 ? `\n\n${numOfEntries}${totalTime}` : ''}`);
                queueEmbed.setFooter({
                    text: `${queue ? `Page ${queuePaginate.current} of ${queuePaginate.total}` : 'Queue is empty.'}`,
                    iconURL: message.author.avatarURL({ dynamic: true })
                });
                await interaction.message.edit({ embeds: [queueEmbed], components: components, allowedMentions: { repliedUser: false } });
            }

            // Next Page Button
            if (interaction.customId === 'next_page') {
                const paginateArray = queuePaginate.next();

                /* Map the array. */
                const queueMap = paginateArray.map(song => `**${songs.indexOf(song) + 1}:** ${song.user} \`${song.formattedDuration}\` [${song.name}](${song.url})`).join('\n');

                /* Need to make sure all buttons are available */
                nextPage.setDisabled(false);
                lastPage.setDisabled(false);
                firstPage.setDisabled(false);
                previousPage.setDisabled(false);
                if (!queuePaginate.hasNext()) {
                    nextPage.setDisabled(true);
                    lastPage.setDisabled(true);
                }

                /* Row of buttons! */
                const buttonRow = new MessageActionRow()
                    .addComponents(firstPage, previousPage, nextPage, lastPage, pageJump);

                /* Rand out of room for the cancel button, so... */
                const cancelRow = new MessageActionRow()
                    .addComponents(cancelButton);

                const components = songs.length === 0 || songs.length <= 10 ? [cancelRow] : [buttonRow, cancelRow];

                /* Making the embed. */
                queueEmbed.setDescription(`${queueMap}${songs.length > 0 ? `\n\n${numOfEntries}${totalTime}` : ''}`);
                queueEmbed.setFooter({
                    text: `${queue ? `Page ${queuePaginate.current} of ${queuePaginate.total}` : 'Queue is empty.'}`,
                    iconURL: message.author.avatarURL({ dynamic: true })
                });
                await interaction.message.edit({ embeds: [queueEmbed], components: components, allowedMentions: { repliedUser: false } });
            }

            // Last Page Button
            if (interaction.customId === 'last_page') {
                const paginateArray = queuePaginate.last();

                /* Map the array. */
                const queueMap = paginateArray.map(song => `**${songs.indexOf(song) + 1}:** ${song.user} \`${song.formattedDuration}\` [${song.name}](${song.url})`).join('\n');

                /* Enable and disable buttons */
                firstPage.setDisabled(false);
                previousPage.setDisabled(false);
                if (!queuePaginate.hasNext()) {
                    nextPage.setDisabled(true);
                    lastPage.setDisabled(true);
                }

                /* Row of buttons! */
                const buttonRow = new MessageActionRow()
                    .addComponents(firstPage, previousPage, nextPage, lastPage, pageJump);

                /* Rand out of room for the cancel button, so... */
                const cancelRow = new MessageActionRow()
                    .addComponents(cancelButton);

                const components = songs.length === 0 || songs.length <= 10 ? [cancelRow] : [buttonRow, cancelRow];

                /* Making the embed. */
                queueEmbed.setDescription(`${queueMap}${songs.length > 0 ? `\n\n${numOfEntries}${totalTime}` : ''}`);
                queueEmbed.setFooter({
                    text: `${queue ? `Page ${queuePaginate.current} of ${queuePaginate.total}` : 'Queue is empty.'}`,
                    iconURL: message.author.avatarURL({ dynamic: true })
                });
                await interaction.message.edit({ embeds: [queueEmbed], components: components, allowedMentions: { repliedUser: false } });
            }

            // Jump to Page Button
            if (interaction.customId === 'page_jump') {
                const filter = i => i.customId === 'modal_jump_page_msg';
                interaction.awaitModalSubmit({
                    filter,
                    time: 30000
                }).then(async intmodal => {
                    await intmodal.deferUpdate();
                    let pageNumber = parseInt(intmodal.fields.getTextInputValue('modal_jump_page_msg_short'));
                    if (pageNumber <= 0) pageNumber = 1; // Pagination works with negative values wtf
                    if (pageNumber >= queuePaginate.total) {
                        const paginateArray = queuePaginate.last();

                        /* Map the array. */
                        const queueMap = paginateArray.map(song => `**${songs.indexOf(song) + 1}:** ${song.user} \`${song.formattedDuration}\` [${song.name}](${song.url})`).join('\n');

                        nextPage.setDisabled(false);
                        lastPage.setDisabled(false);
                        firstPage.setDisabled(false);
                        previousPage.setDisabled(false);

                        if (!queuePaginate.hasNext()) {
                            nextPage.setDisabled(true);
                            lastPage.setDisabled(true);
                        }
                        /* Row of buttons! */
                        const buttonRow = new MessageActionRow()
                            .addComponents(firstPage, previousPage, nextPage, lastPage, pageJump);

                        /* Rand out of room for the cancel button, so... */
                        const cancelRow = new MessageActionRow()
                            .addComponents(cancelButton);

                        const components = songs.length === 0 || songs.length <= 10 ? [cancelRow] : [buttonRow, cancelRow];

                        /* Making the embed. */
                        queueEmbed.setDescription(`${queueMap}${songs.length > 0 ? `\n\n${numOfEntries}${totalTime}` : ''}`);
                        queueEmbed.setFooter({
                            text: `${queue ? `Page ${queuePaginate.current} of ${queuePaginate.total}` : 'Queue is empty.'}`,
                            iconURL: message.author.avatarURL({ dynamic: true })
                        });
                        await intmodal.message.edit({ embeds: [queueEmbed], components: components, allowedMentions: { repliedUser: false } });
                    } else if (pageNumber <= queuePaginate.total) {
                        const paginateArray = queuePaginate.first();

                        /* Map the array. */
                        const queueMap = paginateArray.map(song => `**${songs.indexOf(song) + 1}:** ${song.user} \`${song.formattedDuration}\` [${song.name}](${song.url})`).join('\n');

                        nextPage.setDisabled(false);
                        lastPage.setDisabled(false);
                        firstPage.setDisabled(false);
                        previousPage.setDisabled(false);

                        if (!queuePaginate.hasPrevious()) {
                            firstPage.setDisabled(true);
                            previousPage.setDisabled(true);
                        }

                        /* Row of buttons! */
                        const buttonRow = new MessageActionRow()
                            .addComponents(firstPage, previousPage, nextPage, lastPage, pageJump);

                        /* Rand out of room for the cancel button, so... */
                        const cancelRow = new MessageActionRow()
                            .addComponents(cancelButton);

                        const components = songs.length === 0 || songs.length <= 10 ? [cancelRow] : [buttonRow, cancelRow];

                        /* Making the embed. */
                        queueEmbed.setDescription(`${queueMap}${songs.length > 0 ? `\n\n${numOfEntries}${totalTime}` : ''}`);
                        queueEmbed.setFooter({
                            text: `${queue ? `Page ${queuePaginate.current} of ${queuePaginate.total}` : 'Queue is empty.'}`,
                            iconURL: message.author.avatarURL({ dynamic: true })
                        });
                        await intmodal.message.edit({ embeds: [queueEmbed], components: components, allowedMentions: { repliedUser: false } });
                    }

                    const paginateArray = queuePaginate.page(pageNumber);
                    /* Map the array. */
                    const queueMap = paginateArray.map(song => `**${songs.indexOf(song) + 1}:** ${song.user} \`${song.formattedDuration}\` [${song.name}](${song.url})`).join('\n');

                    nextPage.setDisabled(false);
                    lastPage.setDisabled(false);
                    firstPage.setDisabled(false);
                    previousPage.setDisabled(false);

                    if (!queuePaginate.hasPrevious()) {
                        firstPage.setDisabled(true);
                        previousPage.setDisabled(true);
                    } else if (!queuePaginate.hasNext()) {
                        nextPage.setDisabled(true);
                        lastPage.setDisabled(true);
                    }

                    /* Row of buttons! */
                    const buttonRow = new MessageActionRow()
                        .addComponents(firstPage, previousPage, nextPage, lastPage, pageJump);

                    /* Rand out of room for the cancel button, so... */
                    const cancelRow = new MessageActionRow()
                        .addComponents(cancelButton);

                    const components = songs.length === 0 || songs.length <= 10 ? [cancelRow] : [buttonRow, cancelRow];

                    /* Making the embed. */
                    queueEmbed.setDescription(`${queueMap}${songs.length > 0 ? `\n\n${numOfEntries}${totalTime}` : ''}`);
                    queueEmbed.setFooter({
                        text: `${queue ? `Page ${queuePaginate.current} of ${queuePaginate.total}` : 'Queue is empty.'}`,
                        iconURL: message.author.avatarURL({ dynamic: true })
                    });
                    await intmodal.message.edit({ embeds: [queueEmbed], components: components, allowedMentions: { repliedUser: false } });
                }).catch(x => {});
            }

            // Cancel Button
            if (interaction.customId === 'cancel_button') {
                collector.stop();
                await msg.delete();
                return message.react(process.env.REACTION_OK);
            }
        });

        collector.on('end', async () => {
            await msg.edit({ components: [] });
        });
    }
};
