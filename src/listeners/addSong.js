const { Listener } = require('discord-akairo');
const { Permissions, MessageEmbed } = require('discord.js');
const prettyms = require('pretty-ms');
const iheart = require('iheart');
const ffprobe = require('ffprobe');
const ffprobeStatic = require('ffprobe-static');
const { toColonNotation } = require('colon-notation');

const isAttachment = (url) => {
  // ! TODO: Come up with a better regex lol
  // eslint-disable-next-line no-useless-escape
  const urlPattern = /https?:\/\/(cdn\.)?(discordapp)\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/g;
  const urlRegex = new RegExp(urlPattern);
  return url.match(urlRegex);
};

module.exports = class ListenerAddSong extends Listener {
  constructor () {
    super('addSong', {
      emitter: 'player',
      event: 'addSong'
    });
  }

  async exec (queue, song) {
    const channel = queue.textChannel;
    const guild = channel.guild;
    const member = guild.members.cache.get(queue.songs[queue.songs.length - 1].user.id);
    const prefix = this.client.settings.get(channel.guild.id, 'prefix', process.env.PREFIX);

    // * This is annoying.
    // Basically, grab the message of the user that just added a song to the queue. If there is
    // a match, this information will be used to reply to the user. However, the filter may grab the
    // wrong message. Using it will not guarantee an accurate result.
    const message = channel.messages.cache.filter(x => x.author.id === member.user.id && x.content.startsWith(prefix)).last();

    const djRole = await this.client.settings.get(guild.id, 'djRole');
    const allowAgeRestricted = await this.client.settings.get(guild.id, 'allowAgeRestricted', true);
    const maxTime = await this.client.settings.get(guild.id, 'maxTime');
    const dj = member.roles.cache.has(djRole) || channel.permissionsFor(member.user.id).has(Permissions.FLAGS.MANAGE_CHANNELS);
    if (!allowAgeRestricted) {
      this.client.ui.reply(message, 'no', `**${song.name}** cannot be added because **Age Restricted** tracks are not allowed on this server.`);
      return queue.songs.pop();
    }
    if (maxTime) {
      if (!dj) {
        // DisTube provide the duration as a decimal.
        // Using Math.floor() to round down.
        // Still need to apend '000' to be accurate.
        if (parseInt(Math.floor(song.duration + '000')) > maxTime) {
          this.client.ui.reply(message, 'no', `**${song.name} cannot be added since the duration of this track exceeds the max limits for this server. (\`${prettyms(maxTime, { colonNotation: true })}\`)`);
          queue.songs.pop();
        }
      }
    }

    if (await this.client.radio.get(guild.id) !== undefined && !song.uploader.name) { // Assuming its a radio station.
      // Changes the description of the track, in case its a
      // radio station.
      await iheart.search(`${await this.client.radio.get(guild.id)}`).then(match => {
        const station = match.stations[0];
        song.name = `${station.name} - ${station.description}`;
        song.isLive = true;
        song.thumbnail = station.logo || station.newlogo;
        song.station = `${station.frequency} ${station.band} - ${station.callLetters} ${station.city}, ${station.state}`;
      });
    }

    if (isAttachment(song.url)) {
      const supportedFormats = [
        'mp3',
        'mp4',
        'webm',
        'ogg',
        'wav'
      ];
      if (!supportedFormats.some(element => song.url.endsWith(element))) {
        queue.songs.pop();
        return this.client.ui.reply(message, 'error', `The attachment is invalid. Supported formats: ${supportedFormats.map(x => `\`${x}\``).join(', ')}`);
      } else {
        await ffprobe(song.url, { path: ffprobeStatic.path }).then(info => {
          const time = Math.floor(info.streams[0].duration);
          song.duration = time;
          song.formattedDuration = toColonNotation(time + '000');
          song.isFile = true;
        });
      }
    }  

    // Stupid fix to make sure that the queue doesn't break.
    // TODO: Fix toColonNotation in queue.js
    if (song.isLive) song.duration = 1;

    if (!queue.songs[1]) return; // Don't send to channel if a player was created.
    const embed = new MessageEmbed()
      .setColor(message.guild.me.displayColor !== 0 ? message.guild.me.displayColor : null)
      .setAuthor({
        name: `Added to queue - ${member.voice.channel.name}`,
        iconURL: guild.iconURL({ dynamic: true })
      })
      .setTitle(song.name)
      .setURL(song.url)
      .setThumbnail(song.thumbnail)
      .setFooter({
        text: song.user.tag,
        iconURL: song.user.avatarURL({ dynamic: true })
      });

    if (queue.songs.indexOf(song) === 1) return;
    if (!message.channel) {
      channel.send({ embeds: [embed] });
    } else {
      message.channel.send({ embeds: [embed] });
    }
  }
};
