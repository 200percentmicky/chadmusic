const { Command } = require('discord-akairo');
const { Permissions, MessageEmbed } = require('discord.js');
const Genius = require('genius-lyrics');

module.exports = class CommandLyrics extends Command {
  constructor () {
    super('lyrics', {
      aliases: ['lyrics'],
      category: '🎶 Music',
      description: {
        text: 'Stops the player, and clears the queue.'
      },
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS'],
      args: [
        {
          id: 'query',
          match: 'rest'
        }
      ]
    });
  }

  async exec (message, args) {
    const djMode = this.client.settings.get(message.guild.id, 'djMode');
    const djRole = this.client.settings.get(message.guild.id, 'djRole');
    const dj = message.member.roles.cache.has(djRole) || message.channel.permissionsFor(message.member.user.id).has(Permissions.FLAGS.MANAGE_CHANNELS);
    if (djMode) {
      if (!dj) return this.client.ui.send(message, 'DJ_MODE');
    }

    // Most likely will want the lyrics command to be available to all.
    // I'll leave this commented out for now.

    /*
    const textChannel = this.client.settings.get(message.guild.id, 'textChannel', null);
    if (textChannel) {
      if (textChannel !== message.channel.id) {
        return this.client.ui.send(message, 'WRONG_TEXT_CHANNEL_MUSIC', textChannel);
      }
    }

    const vc = message.member.voice.channel;
    if (!vc) return this.client.ui.send(message, 'NOT_IN_VC');

    const currentVc = this.client.vc.get(vc);
    if (!this.client.player.getQueue(message) || !currentVc) return this.client.ui.send(message, 'NOT_PLAYING');
    else if (vc.id !== currentVc.channel.id) return this.client.ui.send(message, 'ALREADY_SUMMONED_ELSEWHERE');

    if (vc.members.size <= 2 || dj) {
      this.client.player.stop(message);
      this.client.vc.leave(message);
      return this.client.ui.custom(message, '⏹', process.env.COLOR_INFO, 'Stopped the player and cleared the queue.');
    } else {
      return this.client.ui.send(message, 'NOT_ALONE');
    }
    */

    const geniusClient = new Genius.Client(process.env.GENIUS_TOKEN);
    const queue = this.client.player.getQueue(message.guild);

    message.channel.sendTyping();

    try {
      const query = queue.songs[0].name || args.query;

      if (!queue && !args.query) {
        const prefix = this.client.settings.get(message, 'prefix', process.env.PREFIX);
        return this.client.ui.say(message, 'warn', `Nothing is currently playing on this server. Consider a manual search by using \`${prefix}lyrics [query]\`.`);
      }

      const songSearch = await geniusClient.songs.search(query);
      const songLyrics = await songSearch[0].lyrics();

      const embed = new MessageEmbed()
        .setColor(message.guild.me.displayColor !== 0 ? message.guild.me.displayColor : null)
        .setAuthor({
          name: songSearch[0].artist.name,
          url: songSearch[0].artist.url,
          iconURL: songSearch[0].artist.image
        })
        .setTitle(songSearch[0].title)
        .setURL(songSearch[0].url)
        .setDescription(`${songLyrics}`)
        .setThumbnail(songSearch[0].image)
        .setFooter({
          text: `${message.member.user.tag} • Powered by Genius API. (https://genius.com)`,
          iconURL: message.member.user.avatarURL({ dynamic: true })
        });

      return message.reply({ embeds: [embed] });
    } catch (err) {
      if (err) return this.client.ui.reply(message, 'error', err.message, 'Genius API Error');
    }
  }
};
