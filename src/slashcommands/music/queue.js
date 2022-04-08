const { SlashCommand, ComponentType, TextInputStyle } = require('slash-create');
const { MessageButton, MessageActionRow, MessageEmbed } = require('discord.js');
const { Paginator } = require('array-paginator');
const { toColonNotation } = require('colon-notation');

class CommandQueue extends SlashCommand {
    constructor (creator) {
        super(creator, {
            name: 'queue',
            description: 'Shows the player\'s current queue on this server.',
            guildIDs: [process.env.DEV_GUILD]
        });

        this.filePath = __filename;
    }

    async run (ctx) {
        const guild = this.client.guilds.cache.get(ctx.guildID);
        const channel = guild.channels.cache.get(ctx.channelID);
        const member = guild.members.cache.get(ctx.member.id);

        const djMode = this.client.settings.get(guild.id, 'djMode');
        const djRole = this.client.settings.get(guild.id, 'djRole');
        const dj = member.roles.cache.has(djRole) || channel.permissionsFor(member.user.id).has(['MANAGE_CHANNELS']);
        if (djMode) {
            if (!dj) return this.client.ui.send(ctx, 'DJ_MODE');
        }

        const textChannel = this.client.settings.get(guild.id, 'textChannel', null);
        if (textChannel) {
            if (textChannel !== channel.id) {
                return this.client.ui.send(ctx, 'WRONG_TEXT_CHANNEL_MUSIC', textChannel);
            }
        }

        await ctx.defer();

        const queue = this.client.player.getQueue(guild);
        const vc = member.voice.channel;

        if (!vc) return this.client.ui.send(ctx, 'NOT_IN_VC');

        const currentVc = this.client.vc.get(vc);

        if (!this.client.player.getQueue(guild) || !currentVc) return this.client.ui.send(ctx, 'NOT_PLAYING');
        else if (vc.id !== currentVc.channel.id) return this.client.ui.send(ctx, 'ALREADY_SUMMONED_ELSEWHERE');

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
            .setColor(guild.me.displayColor !== 0 ? guild.me.displayColor : null)
            .setAuthor({
                name: `Queue for ${guild.name} - ${currentVc.channel.name}`,
                iconURL: guild.iconURL({ dynamic: true })
            })
            .setDescription(`${queueMap}${songs.length > 0 ? `\n\n${numOfEntries}${totalTime}` : ''}`)
            .addField(`${process.env.EMOJI_MUSIC} Currently Playing`, `**[${song.name}](${song.url})**\n${song.user} \`${song.formattedDuration}\``)
            .setTimestamp()
            .setFooter({
                text: `${songs.length > 0 ? `Page ${queuePaginate.current} of ${queuePaginate.total}` : 'Queue is empty.'}`,
                iconURL: member.user.avatarURL({ dynamic: true })
            });

        // Select Menu Values
        const selectArray = [];
        for (let i = 0; i < queuePaginate.total; i++) {
            const page = {
                label: `Page ${i + 1}`,
                value: `${i + 1}`
            };
            selectArray.push(page);
        }

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
        await ctx.send({ embeds: [queueEmbed], components: components });

        // TODO: Look into combining the collector into a single function.

        // First Page Button
        ctx.registerComponent('first_page', async (btnCtx) => {
            if (ctx.user.id !== btnCtx.user.id) {
                return btnCtx.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(parseInt(process.env.COLOR_NO))
                            .setDescription(`${process.env.EMOJI_NO} That component can only be used by the user that ran this command.`)
                    ],
                    ephemeral: true
                });
            }

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

            /* Ran out of room for the cancel button, so... */
            const cancelRow = new MessageActionRow()
                .addComponents(cancelButton);

            const components = songs.length === 0 || songs.length <= 10 ? [cancelRow] : [buttonRow, cancelRow];

            /* Making the embed. */
            queueEmbed.setDescription(`${queueMap}${songs.length > 0 ? `\n\n${numOfEntries}${totalTime}` : ''}`);
            queueEmbed.setFooter({
                text: `${queue ? `Page ${queuePaginate.current} of ${queuePaginate.total}` : 'Queue is empty.'}`,
                iconURL: member.user.avatarURL({ dynamic: true })
            });
            await btnCtx.editParent({ embeds: [queueEmbed], components: components, allowedMentions: { repliedUser: false } });
        }, 300 * 1000);

        // Previous Page Button
        ctx.registerComponent('previous_page', async (btnCtx) => {
            if (ctx.user.id !== btnCtx.user.id) {
                return btnCtx.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(parseInt(process.env.COLOR_NO))
                            .setDescription(`${process.env.EMOJI_NO} That component can only be used by the user that ran this command.`)
                    ],
                    ephemeral: true
                });
            }

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

            /* Ran out of room for the cancel button, so... */
            const cancelRow = new MessageActionRow()
                .addComponents(cancelButton);

            const components = songs.length === 0 || songs.length <= 10 ? [cancelRow] : [buttonRow, cancelRow];

            /* Making the embed. */
            queueEmbed.setDescription(`${queueMap}${songs.length > 0 ? `\n\n${numOfEntries}${totalTime}` : ''}`);
            queueEmbed.setFooter({
                text: `${queue ? `Page ${queuePaginate.current} of ${queuePaginate.total}` : 'Queue is empty.'}`,
                iconURL: member.user.avatarURL({ dynamic: true })
            });
            await btnCtx.editParent({ embeds: [queueEmbed], components: components, allowedMentions: { repliedUser: false } });
        }, 300 * 1000);

        // Next Page Button
        ctx.registerComponent('next_page', async (btnCtx) => {
            if (ctx.user.id !== btnCtx.user.id) {
                return btnCtx.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(parseInt(process.env.COLOR_NO))
                            .setDescription(`${process.env.EMOJI_NO} That component can only be used by the user that ran this command.`)
                    ],
                    ephemeral: true
                });
            }

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

            /* Ran out of room for the cancel button, so... */
            const cancelRow = new MessageActionRow()
                .addComponents(cancelButton);

            const components = songs.length === 0 || songs.length <= 10 ? [cancelRow] : [buttonRow, cancelRow];

            /* Making the embed. */
            queueEmbed.setDescription(`${queueMap}${songs.length > 0 ? `\n\n${numOfEntries}${totalTime}` : ''}`);
            queueEmbed.setFooter({
                text: `${queue ? `Page ${queuePaginate.current} of ${queuePaginate.total}` : 'Queue is empty.'}`,
                iconURL: member.user.avatarURL({ dynamic: true })
            });
            await btnCtx.editParent({ embeds: [queueEmbed], components: components, allowedMentions: { repliedUser: false } });
        }, 300 * 1000);

        // Last Page Button
        ctx.registerComponent('last_page', async (btnCtx) => {
            if (ctx.user.id !== btnCtx.user.id) {
                return btnCtx.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(parseInt(process.env.COLOR_NO))
                            .setDescription(`${process.env.EMOJI_NO} That component can only be used by the user that ran this command.`)
                    ],
                    ephemeral: true
                });
            }

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

            /* Ran out of room for the cancel button, so... */
            const cancelRow = new MessageActionRow()
                .addComponents(cancelButton);

            const components = songs.length === 0 || songs.length <= 10 ? [cancelRow] : [buttonRow, cancelRow];

            /* Making the embed. */
            queueEmbed.setDescription(`${queueMap}${songs.length > 0 ? `\n\n${numOfEntries}${totalTime}` : ''}`);
            queueEmbed.setFooter({
                text: `${queue ? `Page ${queuePaginate.current} of ${queuePaginate.total}` : 'Queue is empty.'}`,
                iconURL: member.user.avatarURL({ dynamic: true })
            });
            await btnCtx.editParent({ embeds: [queueEmbed], components: components, allowedMentions: { repliedUser: false } });
        }, 300 * 1000);

        // Jump to Page Button
        ctx.registerComponent('page_jump', async (btnCtx) => {
            if (ctx.user.id !== btnCtx.user.id) {
                return btnCtx.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(parseInt(process.env.COLOR_NO))
                            .setDescription(`${process.env.EMOJI_NO} That component can only be used by the user that ran this command.`)
                    ],
                    ephemeral: true
                });
            }

            await btnCtx.sendModal({
                title: 'Select Page',
                components: [
                    {
                        type: ComponentType.ACTION_ROW,
                        components: [{
                            type: ComponentType.TEXT_INPUT,
                            custom_id: 'new_page',
                            style: TextInputStyle.SHORT,
                            required: true,
                            max_length: 3,
                            label: 'Which page do you want to jump to?'
                        }]
                    }
                ]
            }, async (modalCtx) => {
                if (isNaN(modalCtx.values.new_page)) {
                    return modalCtx.send({
                        embeds: [
                            new MessageEmbed()
                                .setColor(parseInt(process.env.COLOR_ERROR))
                                .setDescription(`${process.env.EMOJI_ERROR} A number must be provided in your response. Please try again.`)
                        ],
                        ephemeral: true
                    });
                }

                let pageNumber = parseInt(modalCtx.values.new_page);
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

                    /* Ran out of room for the cancel button, so... */
                    const cancelRow = new MessageActionRow()
                        .addComponents(cancelButton);

                    const components = songs.length === 0 || songs.length <= 10 ? [cancelRow] : [buttonRow, cancelRow];

                    /* Making the embed. */
                    queueEmbed.setDescription(`${queueMap}${songs.length > 0 ? `\n\n${numOfEntries}${totalTime}` : ''}`);
                    queueEmbed.setFooter({
                        text: `${queue ? `Page ${queuePaginate.current} of ${queuePaginate.total}` : 'Queue is empty.'}`,
                        iconURL: member.user.avatarURL({ dynamic: true })
                    });
                    await modalCtx.editParent({ embeds: [queueEmbed], components: components, allowedMentions: { repliedUser: false } });
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

                    /* Ran out of room for the cancel button, so... */
                    const cancelRow = new MessageActionRow()
                        .addComponents(cancelButton);

                    const components = songs.length === 0 || songs.length <= 10 ? [cancelRow] : [buttonRow, cancelRow];

                    /* Making the embed. */
                    queueEmbed.setDescription(`${queueMap}${songs.length > 0 ? `\n\n${numOfEntries}${totalTime}` : ''}`);
                    queueEmbed.setFooter({
                        text: `${queue ? `Page ${queuePaginate.current} of ${queuePaginate.total}` : 'Queue is empty.'}`,
                        iconURL: member.user.avatarURL({ dynamic: true })
                    });
                    await modalCtx.editParent({ embeds: [queueEmbed], components: components, allowedMentions: { repliedUser: false } });
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

                /* Ran out of room for the cancel button, so... */
                const cancelRow = new MessageActionRow()
                    .addComponents(cancelButton);

                const components = songs.length === 0 || songs.length <= 10 ? [cancelRow] : [buttonRow, cancelRow];

                /* Making the embed. */
                queueEmbed.setDescription(`${queueMap}${songs.length > 0 ? `\n\n${numOfEntries}${totalTime}` : ''}`);
                queueEmbed.setFooter({
                    text: `${queue ? `Page ${queuePaginate.current} of ${queuePaginate.total}` : 'Queue is empty.'}`,
                    iconURL: member.user.avatarURL({ dynamic: true })
                });
                await modalCtx.editParent({ embeds: [queueEmbed], components: components, allowedMentions: { repliedUser: false } });
            });
        });

        // Cancel Button
        ctx.registerComponent('cancel_button', async (btnCtx) => {
            if (ctx.user.id !== btnCtx.user.id) {
                return btnCtx.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(parseInt(process.env.COLOR_NO))
                            .setDescription(`${process.env.EMOJI_NO} That component can only be used by the user that ran this command.`)
                    ],
                    ephemeral: true
                });
            }

            btnCtx.acknowledge();
            btnCtx.delete();
        });
    }
}

module.exports = CommandQueue;
