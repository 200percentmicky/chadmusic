const { Command } = require('discord-akairo');
const { MessageEmbed, MessageActionRow, MessageSelectMenu, MessageButton, MessageFlags } = require('discord.js');
const { Permissions } = require('discord.js');

module.exports = class CommandSearch extends Command {
  constructor () {
    super('search', {
      aliases: ['search'],
      category: '🎶 Music',
      description: {
        text: 'Searches for a song on YouTube.',
        usage: '<query>'
      },
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS']
    });
  }

  async exec (message) {
    const args = message.content.split(/ +/g);
    const search = args.slice(1).join(' ');
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

    const vc = message.member.voice.channel;
    if (!vc) return this.client.ui.reply(message, 'error', 'You are not in a voice channel.');

    message.channel.sendTyping();
    const currentVc = this.client.vc.get(vc);
    if (!currentVc) {
      const permissions = vc.permissionsFor(this.client.user.id).has(['CONNECT']);
      if (!permissions) return this.client.ui.reply(message, 'no', `Missing **Connect** permission for <#${vc.id}>`);

      if (vc.type === 'stage') {
        await this.client.vc.join(vc); // Must be awaited only if the VC is a Stage Channel.
        const stageMod = vc.permissionsFor(this.client.user.id).has(Permissions.STAGE_MODERATOR);
        if (!stageMod) {
          const requestToSpeak = vc.permissionsFor(this.client.user.id).has(['REQUEST_TO_SPEAK']);
          if (!requestToSpeak) {
            vc.leave();
            return this.client.ui.reply(message, 'no', `Missing **Request to Speak** permission for <#${vc.id}>.`);
          } else if (message.guild.me.voice.suppress) {
            await message.guild.me.voice.setRequestToSpeak(true);
          }
        } else {
          await message.guild.me.voice.setSuppressed(false);
        }
      } else {
        this.client.vc.join(vc);
      }
    } else {
      if (vc.id !== currentVc.channel.id) return this.client.ui.reply(message, 'error', 'You must be in the same voice channel that I\'m in to use that command.');
    }

    message.channel.sendTyping();
    const queue = this.client.player.getQueue(message.guild.id);

    if (!args[1]) return this.client.ui.usage(message, 'search <query>');

    // These limitations should not affect a member with DJ permissions.
    if (!dj) {
      if (queue) {
        const maxQueueLimit = await this.client.maxQueueLimit.get(message.guild.id);
        if (maxQueueLimit) {
          const queueMemberSize = queue.songs.filter(entries => entries.user.id === message.member.user.id).length;
          if (queueMemberSize >= maxQueueLimit) {
            this.client.ui.reply(message, 'no', `You are only allowed to add a max of ${maxQueueLimit} entr${maxQueueLimit === 1 ? 'y' : 'ies'} to the queue.`);
          }
        }
      }
    }

    message.channel.sendTyping();

    const results = await this.client.player.search(search);

    const embed = new MessageEmbed()
      .setColor(message.guild.me.displayColor !== 0 ? message.guild.me.displayColor : null)
      .setAuthor({
        name: 'Which track do you wanna play?',
        iconURL: message.author.avatarURL({ dynamic: true })
      })
      .setFooter({
        text: `Make your selection using the menu below.`
      });

    let menuOptions = [];
    let i;
    for (i = 0; i < results.length; i++) {
      const track = {
        label: results[i].name,
        description: `${results[i].formattedDuration} • ${results[i].uploader.name}`,
        value: `${i}`
      };
      menuOptions.push(track);
    }

    const menu = new MessageSelectMenu()
      .setCustomId('track_menu')
      .setPlaceholder('Pick a track!')
      .addOptions(menuOptions)
    
    const cancel = new MessageButton()
      .setCustomId('cancel_search')
      .setStyle('DANGER')
      .setEmoji(process.env.CLOSE)

    const trackMenu = new MessageActionRow()
      .addComponents(menu)

    const cancelButton = new MessageActionRow()
      .addComponents(cancel)

    const msg = await message.reply({ embeds: [embed], components: [trackMenu, cancelButton], allowedMentions: { repliedUser: false } });

    const filter = (interaction) => interaction.user.id === message.member.user.id;
    const collector = msg.createMessageComponentCollector({
      filter,
      time: 30 * 1000,
      max: 1,
    })
    
    collector.on('collect', async interaction => {
      if (interaction.customId === 'cancel_search') return collector.stop();
      message.channel.sendTyping();
      await this.client.player.play(vc, results[parseInt(interaction.values[0])].url, {
        member: message.member,
        textChannel: message.channel,
        message: message
      });
      message.react(process.env.EMOJI_MUSIC)
      collector.stop();
    });

    collector.on('end', () => {
      msg.delete();
    })

    /*
    this.client.player.search(search).then(results => {
      const resultMap = results.slice(0, 10).map(result => `${results.indexOf(result) + 1}: \`${result.formattedDuration}\` [${result.name}](${result.url})`).join('\n\n');
      const embed = new MessageEmbed()
        .setColor(message.guild.me.displayColor !== 0 ? message.guild.me.displayColor : null)
        .setAuthor({
          name: 'Which track do you wanna play?',
          iconURL: message.author.avatarURL({ dynamic: true })
        })
        .setDescription(`${resultMap}`)
        .setFooter({
          text: 'Type the number of your selection, or type "cancel" if you changed your mind.'
        });

      // TODO: Replace collector for a select menu instead.

      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } }).then(msg => {
        const filter = m => m.author.id === message.author.id;
        const collector = message.channel.createMessageCollector({
          filter,
          max: 1,
          time: 30000,
          errors: ['time']
        });

        collector.on('collect', async collected => {
          collector.stop();
          collected.delete();
          if (collected.content === 'CANCEL'.toLowerCase()) return;
          message.channel.sendTyping();
          let selected = results[parseInt(collected.content - 1)].url;
          if (collected.content > 10) {
            selected = results[9].url;
            this.client.ui.reply(message, 'info', `Your input was \`${collected.content}\`. The 10th result was queued instead.`);
          } else if (collected.content <= 0) { // Why even bother? The bot can't comprehend a negative integer for some reason...
            selected = results[0].url;
            this.client.ui.reply(message, 'info', `Your input was \`${collected.content}\`. The 1st result was queued instead.`);
          }
          await this.client.player.play(vc, selected, {
            member: message.member,
            textChannel: message.channel,
            message: message
          });
          message.react(process.env.REACTION_OK);
        });

        collector.on('end', () => {
          msg.delete();
        });
      });
    });
    */
  }
};
