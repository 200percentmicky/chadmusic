/**
 *  ChadMusic - The Chad Music Bot
 *  Copyright (C) 2021  Micky D. | @200percentmicky | Micky-kun#3836
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

'use strict';

const logger = require('./modules/winstonLogger');

// Say hello!
const { version } = require('../package.json');
logger.info('   ________              ____  ___           _');
logger.info('  / ____/ /_  ____ _____/ /  |/  /_  _______(_)____');
logger.info(' / /   / __ \\/ __ `/ __  / /|_/ / / / / ___/ / ___/');
logger.info('/ /___/ / / / /_/ / /_/ / /  / / /_/ (__  ) / /__');
logger.info('\\____/_/ /_/\\__,_/\\__,_/_/  /_/\\__,_/____/_/\\___/');  
                                                 
logger.info('Created by Micky D. | @200percentmicky | Micky-kun#3836')
logger.info('Bot Version: %s', version);
logger.info('Loading libraries...');

const { AkairoClient, CommandHandler, ListenerHandler, InhibitorHandler, MongooseProvider } = require('discord-akairo');
const { Intents } = require('discord.js');
const { SlashCreator, GatewayServer } = require('slash-create');
const DisTube = require('../chadtube/dist').default;
const { SpotifyPlugin } = require('@distube/spotify');
const { YtDlpPlugin } = require('@distube/yt-dlp');
const mongoose = require('mongoose');
const Keyv = require('keyv');
const Enmap = require('enmap');
const ui = require('./modules/WaveUI');
const slashUI = require('./modules/WaveSlashUI');
const path = require('path');

/* Connecting to databases... */
mongoose.connect(process.env.MONGO_URI_MAIN, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.connection.on('error', error => {
  logger.error('[Mongoose] An error occured when connecting to the database. Is MongoDB installed and running? Is MONGO_URI_MAIN valid?\n%s', error);
})
  .on('ready', () => logger.info('[Mongoose] Connection established!'));

// Let's boogie!
class WaveBot extends AkairoClient {
  constructor () {
    super({
      ownerID: process.env.OWNER_ID
    }, {
      allowedMentions: {
        repliedUser: false
      },
      restTimeOffset: 175,
      intents: new Intents(14279)
    });

    // Calling packages that can be used throughout the client.
    this.logger = logger;
    this.ui = ui;
    this.utils = require('bot-utils');

    // Music Player.
    this.player = new DisTube(this, {
      plugins: [
        new SpotifyPlugin({
          emitEventsAfterFetching: true
        }),
        new YtDlpPlugin()
      ],
      emitNewSongOnly: process.env.EMIT_NEW_SONG_ONLY === 'true' || false,
      leaveOnStop: process.env.LEAVE_ON_STOP === 'true' || false,
      leaveOnEmpty: process.env.LEAVE_ON_EMPTY === 'true' || false,
      leaveOnFinish: process.env.LEAVE_ON_FINISH === 'true' || false,
      youtubeCookie: process.env.YOUTUBE_COOKIE,
      ytdlOptions: {
        quality: 'highestaudio',
        filter: 'audioonly',
        dlChunkSize: 25000,
        highWaterMark: 1024
      },
      youtubeDL: false,
      updateYouTubeDL: process.env.UPDATE_YOUTUBE_DL === 'true' || false,
      nsfw: true // Being handled on a per guild basis, not client-wide.
    });
    this.vc = this.player.voices; // @discordjs/voice
    this.radio = new Keyv(); // Parse radio info. TODO: Replace this with Map() instead.

    this.creator = new SlashCreator({
      token: process.env.TOKEN,
      applicationID: process.env.APP_ID,
      publicKey: process.env.PUBLIC_KEY
    });

    this.creator.client = this; // Make the AkairoClient accessible in slash commands.
    this.creator.ui = slashUI;
    this.creator.on('commandError', (command, err, ctx) => {
      this.logger.error('%s', err);
    });
    // Gateway Server
    this.creator.withServer(
      new GatewayServer(
        (handler) => this.ws.on('INTERACTION_CREATE', handler)
      )
    );

    // Register commands in the "commands" directory.
    this.creator.registerCommandsIn(path.join(__dirname, 'slashcommands'));
    this.creator.syncCommands({ // Sync all commands with Discord.
      deleteCommands: true,
      skipGuildErrors: true,
      syncGuilds: true,
      syncPermissions: true
    });

    this.settings = new MongooseProvider(require('./modules/SettingsProvider.js')); // Settings Provider
    this.modlog = new Enmap({ name: 'modlog' }); // The database that manages modlog cases.

    // Create Command Handler
    this.commands = new CommandHandler(this, {
      directory: './src/commands',
      prefix: message => {
        if (message.guild) {
          return this.settings.get(message.guild.id, 'prefix', process.env.PREFIX);
        } else {
          return process.env.PREFIX;
        }
      },
      commandUtil: true,
      handleEdits: true,
      allowMention: true
    });

    // Create Listener Handler
    this.listeners = new ListenerHandler(this, {
      directory: './src/listeners'
    });

    // Create Inhibitor Handler
    this.inhibitors = new InhibitorHandler(this, {
      directory: './src/inhibitors'
    });

    // Set custom emitters
    this.listeners.setEmitters({
      process: process,
      commandHandler: this.commands,
      player: this.player
    });

    this.commands.useInhibitorHandler(this.inhibitors); // Use all Inhibitors.
    this.commands.useListenerHandler(this.listeners); // Use all Listeners.

    this.commands.loadAll(); // Load all Inhibitors
    this.listeners.loadAll(); // Load all Listeners.

    // In the case of production, load all Inhibitors.
    if (process.env.DEV === 'true') {
      this.inhibitors.loadAll();
    }
  }

  // This is required to load the mongoose provider.
  async login (token) {
    await this.settings.init();
    return super.login(token);
  }
}

module.exports = WaveBot;
