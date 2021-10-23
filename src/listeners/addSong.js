const { Listener } = require('discord-akairo');
const { Permissions } = require('discord.js');
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
    if (queue.repeatMode > 0) return;
    const channel = queue.textChannel;
    const guild = channel.guild;
    const member = guild.members.cache.get(queue.songs[queue.songs.length - 1].user.id);
    const prefix = this.client.settings.get(channel.guild.id, 'prefix', process.env.PREFIX);

    // This is annoying.
    const message = channel.messages.cache.filter(x => x.author.id === member.user.id && x.content.startsWith(prefix)).last();

    const djRole = await this.client.settings.get(guild.id, 'djRole');
    const allowAgeRestricted = await this.client.settings.get(guild.id, 'allowAgeRestricted', true);
    const maxTime = await this.client.settings.get(guild.id, 'maxTime');
    const dj = member.roles.cache.has(djRole) || channel.permissionsFor(member.user.id).has(Permissions.FLAGS.MANAGE_CHANNELS);
    if (!allowAgeRestricted) {
      queue.songs.pop();
      return this.client.ui.say(message, 'no', 'You cannot add **Age Restricted** videos to the queue.');
    }
    if (maxTime) {
      if (!dj) {
        // DisTube provide the duration as a decimal.
        // Using Math.floor() to round down.
        // Still need to apend '000' to be accurate.
        if (parseInt(Math.floor(song.duration + '000')) > maxTime) {
          queue.songs.pop();
          return this.client.ui.say(message, 'no', `You cannot add this song to the queue since the duration of this song exceeds the max limit of \`${prettyms(maxTime, { colonNotation: true })}\` for this server.`);
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

    // Stupid fix to make sure that the queue doesn't break.
    // TODO: Fix toColonNotation in queue.js
    if (song.isLive) song.duration = 1;

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

    this.client.ui.say(message, 'ok', `${song.user} added **${song.name}** to the queue.`);
  }
};
