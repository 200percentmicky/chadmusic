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
      if (!dj) return this.client.ui.reply(message, 'no', 'DJ Mode is currently active. You must have the DJ Role or the **Manage Channels** permission to use music commands at this time.', 'DJ Mode');
    }

    const textChannel = this.client.settings.get(message.guild.id, 'textChannel', null);
    if (textChannel) {
      if (textChannel !== message.channel.id) {
        return this.client.ui.reply(message, 'no', `Music commands must be used in <#${textChannel}>.`);
      }
    }

    const queue = this.client.player.getQueue(message);
    const vc = message.member.voice.channel;

    if (!vc) return this.client.ui.reply(message, 'error', 'You are not in a voice channel.');

    const currentVc = this.client.vc.get(vc);

    if (!this.client.player.getQueue(message) || !currentVc) return this.client.ui.reply(message, 'warn', 'Nothing is currently playing in this server.');
    else if (vc.id !== currentVc.channel.id) return this.client.ui.reply(message, 'error', 'You must be in the same voice channel that I\'m in to use that command.');

    /* Getting the entire queue. */
    const songs = queue.songs.slice(1);
    const song = queue.songs[0];

    /* Create a paginated array. */
    const queuePaginate = new Paginator(songs, 10);

    /* Get the page of the array. */
    const paginateArray = queuePaginate.page(1);

    // This includes the currently playing song btw...
    const numOfEntries = songs.length > 0 ? `${songs.length} entr${queue.songs.length === 1 ? 'y' : 'ies'}` : '';
    const trueTime = songs.map(x => x.duration).reduce((a, b) => a + b);
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
    const filter = interaction => interaction.user.id === message.author.id;
    const collector = await msg.createMessageComponentCollector({
      filter,
      componentType: 'BUTTON',
      time: 30000
    });

    collector.on('collect', async interaction => {
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
        collector.resetTimer({
          time: 30000,
          idle: 30000
        });
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
        collector.resetTimer({
          time: 30000,
          idle: 30000
        });
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
        collector.resetTimer({
          time: 30000,
          idle: 30000
        });
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
          collector.resetTimer({
            time: 30000,
            idle: 30000
          });
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
        collector.resetTimer({
          time: 30000,
          idle: 30000
        });
      }

      // Jump to Page Button
      if (interaction.customId === 'page_jump') {
        message.reply('What page do you wanna go to?').then(async pageMsg => {
          const filter = m => m.author.id === message.author.id && !isNaN(m.content);
          const collector = message.channel.createMessageCollector({
            filter,
            max: 1,
            time: 15000,
            errors: ['time']
          });

          collector.on('collect', async collected => {
            const msg2 = collected;
            const pageNumber = parseInt(msg2.content);
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
              await interaction.message.edit({ embeds: [queueEmbed], components: components, allowedMentions: { repliedUser: false } });
              msg2.delete();
              pageMsg.delete();
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
              await interaction.message.edit({ embeds: [queueEmbed], components: components, allowedMentions: { repliedUser: false } });
              msg2.delete();
              pageMsg.delete();
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
            await interaction.message.edit({ embeds: [queueEmbed], components: components, allowedMentions: { repliedUser: false } });
            msg2.delete();
            pageMsg.delete();
            collector.resetTimer({
              time: 30000,
              idle: 30000
            });
          });

          collector.on('end', async () => {
            await pageMsg.delete();
          });
        });
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
