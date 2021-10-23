const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const { splitBar } = require('string-progressbar');

module.exports = class CommandNowPlaying extends Command {
  constructor () {
    super('nowplaying', {
      aliases: ['nowplaying', 'np'],
      category: '🎶 Music',
      description: {
        text: 'Shows the currently playing song.'
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
      if (!dj) return this.client.ui.say(message, 'no', 'DJ Mode is currently active. You must have the DJ Role or the **Manage Channels** permission to use music commands at this time.', 'DJ Mode');
    }

    const textChannel = this.client.settings.get(message.guild.id, 'textChannel', null);
    if (textChannel) {
      if (textChannel !== message.channel.id) {
        return this.client.ui.say(message, 'no', `Music commands must be used in <#${textChannel}>.`);
      }
    }

    const vc = message.member.voice.channel;
    if (!vc) return this.client.ui.reply(message, 'error', 'You are not in a voice channel.');

    const currentVc = this.client.vc.get(vc);
    if (!this.client.player.getQueue(message) || !currentVc) return this.client.ui.say(message, 'warn', 'Nothing is currently playing in this server.');
    else if (vc.id !== currentVc.channel.id) return this.client.ui.reply(message, 'error', 'You must be in the same voice channel that I\'m in to use that command.');

    const queue = this.client.player.getQueue(message);

    const song = queue.songs[0];
    const total = song.duration;
    const current = queue.currentTime;
    const author = song.uploader;

    let progressBar;
    if (!song.isLive) progressBar = splitBar(total, current, 17)[0];
    const duration = song.isLive ? '🔴 **Live**' : `${queue.formattedCurrentTime} [${progressBar}] ${song.formattedDuration}`;
    const embed = new MessageEmbed()
      .setColor(message.guild.me.displayColor !== 0 ? message.guild.me.displayColor : null)
      .setAuthor(`Currently playing in ${currentVc.channel.name}`, message.guild.iconURL({ dynamic: true }))
      .setDescription(`${duration}`)
      .setTitle(song.name)
      .setURL(song.url)
      .setThumbnail(song.thumbnail);

    if (queue.paused) {
      const prefix = this.client.settings.get(message.guild.id, 'prefix', process.env.PREFIX);
      embed.addField('⏸ Paused', `Type '${prefix}resume' to resume playback.`);
    }

    if (song.age_restricted) {
      embed.addField('Explicit', '🔞 This track is **Age Restricted**');
    }

    if (author.name) embed.addField('Uploader', `[${author.name}](${author.url})`);
    if (song.station) embed.addField('Station', `${song.station}`);

    embed
      .addField('Requested by', `${song.user}`, true)
      .addField('Volume', `${queue.volume}%`, true)
      .addField('📢 Filters', `${queue.filters.length > 0 ? `${queue.filters.map(x => `**${x.name}:** ${x.value}`)}` : 'None'}`)
      .setTimestamp();

    return message.channel.send({ embeds: [embed] });
  }
};
