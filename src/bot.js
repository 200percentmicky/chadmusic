/**
 * Project Wave
 *
 * MIT License
 *
 * Copyright (c) 2021 Michael L. Dickerson | Twitter: @200percentmicky | Discord: Micky-kun#3836
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

'use strict';

const { AkairoClient, CommandHandler, ListenerHandler, InhibitorHandler, MongooseProvider } = require('discord-akairo');
const { Intents } = require('discord.js');
const { SlashCreator, GatewayServer } = require('slash-create');
const DisTube = require('../chadtube/dist').default;
const { SpotifyPlugin } = require('@distube/spotify');
const mongoose = require('mongoose');
const Enmap = require('enmap');
const Keyv = require('keyv');
const ui = require('./modules/WaveUI');
const logger = require('./modules/winstonLogger');
const path = require('path');

// Say hello!
const { version } = require('../package.json');
logger.info('/////////////////////////////');
logger.info('    * * * Project Wave * * *');
logger.info('/////////////////////////////');
logger.info('Bot Version: %s', version);

/* Connecting to databases... */
mongoose.connect(process.env.MONGO_URI_MAIN, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.connection.on('error', error => logger.error('[Mongoose] Connection Error: %s', error))
  .on('ready', () => logger.info('[Mongoose] Connection established!'));

// Let's boogie!
class WaveBot extends AkairoClient {
  constructor () {
    super({
      ownerID: process.env.OWNER_ID
    }, {
      disableMentions: 'true',
      restTimeOffset: 175,
      intents: new Intents(14279)
    });

    // Calling packages that can be used throughout the client.
    this.logger = logger;
    this.ui = ui;

    // Music Player.
    this.player = new DisTube(this, {
      plugins: [
        new SpotifyPlugin({
          emitEventsAfterFetching: true
        })
      ],
      emitNewSongOnly: process.env.EMIT_NEW_SONG_ONLY === 'true' || false,
      leaveOnStop: process.env.LEAVE_ON_STOP === 'true' || false,
      leaveOnEmpty: process.env.LEAVE_ON_EMPTY === 'true' || false,
      leaveOnFinish: process.env.LEAVE_ON_FINISH === 'true' || false,
      youtubeCookie: process.env.YOUTUBE_COOKIE,
      ytdlOptions: {
        format: {
          quality: '134'
        },
        highWaterMark: 1 >> 25,
        liveBuffer: 3000,
        dlChunkSize: 2048
      },
      youtubeDL: process.env.USE_YOUTUBE_DL === 'true' || false,
      updateYouTubeDL: process.env.UPDATE_YOUTUBE_DL === 'true' || false,
      nsfw: true // Being handled on a per guild basis, not client-wide.
    });
    this.vc = this.player.voices; // @discordjs/voice
    this.votes = new Enmap();
    this.radio = new Keyv(); // Parse radio info.

    this.creator = new SlashCreator({
      token: process.env.TOKEN,
      applicationID: process.env.APP_ID,
      publicKey: process.env.PUBLIC_KEY
    });

    this.creator.client = this; // Make the AkairoClient accessible in slash commands.
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
    this.modlog = require('./modules/WaveModlog'); // Handler to manage modlog cases in a guild.
    this.modlogCases = new Enmap({ name: 'modlog' }); // The database that manages modlog cases.

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
