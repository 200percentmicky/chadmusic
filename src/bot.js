/// ChadMusic - The Chad Music Bot
/// Copyright (C) 2024  Micky | 200percentmicky
///
/// This program is free software: you can redistribute it and/or modify
/// it under the terms of the GNU General Public License as published by
/// the Free Software Foundation, either version 3 of the License, or
/// (at your option) any later version.
///
/// This program is distributed in the hope that it will be useful,
/// but WITHOUT ANY WARRANTY; without even the implied warranty of
/// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
/// GNU General Public License for more details.
///
/// You should have received a copy of the GNU General Public License
/// along with this program.  If not, see <https://www.gnu.org/licenses/>.

'use strict';

const logger = require('./modules/ChadLogger.js');
const { AkairoClient, CommandHandler, ListenerHandler, InhibitorHandler } = require('discord-akairo');
const { ChannelType, GatewayIntentBits, Partials, REST } = require('discord.js');
const { SlashCreator, GatewayServer } = require('slash-create');
const DisTube = require('distube').default;
const { SpotifyPlugin } = require('@distube/spotify');
const { YtDlpPlugin } = require('@distube/yt-dlp');
const Enmap = require('enmap');
const ChadUI = require('./modules/ChadUI');
const ChadUtils = require('./modules/ChadUtils');
const path = require('path');
const fs = require('fs');
const { version } = require('../package.json');
const { getInfo, ClusterClient } = require('discord-hybrid-sharding');

// Let's boogie!
class ChadMusic extends AkairoClient {
    constructor () {
        super({
            ownerID: process.env.OWNER_ID
        }, {
            allowedMentions: {
                repliedUser: false
            },
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.DirectMessageReactions
            ],
            partials: [
                Partials.Channel,
                Partials.Message,
                Partials.User
            ],
            shards: process.env.SHARDING ? getInfo().SHARD_LIST : [0],
            shardCount: process.env.SHARDING ? getInfo().TOTAL_SHARDS : 1
        });

        // Hybrid sharding
        this.cluster = process.env.SHARDING ? new ClusterClient(this) : undefined;

        // Calling packages that can be used throughout the client.
        this.logger = logger;
        this.ui = ChadUI;
        this.utils = ChadUtils;
        this.extraUtils = require('bot-utils');
        this.rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

        // Bot version.
        this.version = `${version}`;

        this.settings = new Enmap({ name: 'settings' });
        this.playlists = new Enmap({ name: 'playlists' });

        this.defaultSettings = {
            prefix: process.env.PREFIX,
            djRole: null,
            djMode: false,
            maxTime: null,
            maxQueueLimit: null,
            allowFilters: true,
            allowAgeRestricted: true,
            allowFreeVolume: false,
            allowLinks: true,
            allowSilent: true,
            defaultVolume: 100,
            textChannel: null,
            songVcStatus: true,
            votingPercent: 0.5,
            blockedPhrases: [],
            thumbnailSize: 'small',
            emptyCooldown: 60,
            leaveOnStop: true,
            leaveOnEmpty: true,
            leaveOnFinish: true
        };

        this.defaultGlobalSettings = {
            emitNewSongOnly: true,
            emptyCooldown: 60,
            leaveOnStop: true,
            leaveOnEmpty: true,
            leaveOnFinish: true,
            streamType: 0,
            emojis: {
                message: {
                    ok: ':white_check_mark:',
                    warn: ':warning:',
                    err: ':x:',
                    info: ':information_source:',
                    question: ':question_mark:',
                    no: ':no_entry_sign:',
                    loading: ':watch:',
                    cutie: ':notes:',
                    music: ':musical_note:'
                },
                reaction: {
                    ok: '✅',
                    warn: ':warning:️',
                    err: ':x:',
                    info: ':information_source:',
                    question: '❓',
                    no: ':no_entry_sign:',
                    loading: '⌚',
                    cutie: '🎶',
                    music: '🎵'
                },
                buttons: {
                    first: '⏮',
                    previous: '⬅',
                    nest: '➡',
                    last: '⏭️',
                    jump: '↗',
                    close: '✖'
                }
            },
            colors: {
                ok: 7844437,
                warn: 16763981,
                info: 37887,
                err: 16711680,
                question: 12020223,
                no: 14495300,
                music: 37887
            }
        };

        this.settings.ensure('global', this.defaultGlobalSettings);

        this.cookies = () => {
            const cookies = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'cookies.json')));
            if (cookies.length === 0) {
                return process.env.YOUTUBE_COOKIE;
            } else {
                return cookies;
            }
        };

        // Music Player.
        this.player = new DisTube(this, {
            plugins: [
                new SpotifyPlugin({
                    emitEventsAfterFetching: process.env.SPOTIFY_EMIT_EVENTS_AFTER_FETCHING === 'false' ?? false,
                    parallel: process.env.SPOTIFY_PARALLEL === 'true' ?? true
                }),
                new YtDlpPlugin({ update: true })
            ],
            emitAddListWhenCreatingQueue: true,
            emitAddSongWhenCreatingQueue: true,
            emitNewSongOnly: this.settings.get('global', 'emitNewSongOnly') ?? true,
            emptyCooldown: 60,
            leaveOnStop: false, // this.settings.get('global', 'leaveOnStop') ?? true,
            leaveOnEmpty: false, // this.settings.get('global', 'leaveOnEmpty') ?? true,
            leaveOnFinish: false, // this.settings.get('global', 'leaveOnFinish') ?? true,
            streamType: this.settings.get('global', 'streamType') ?? 0,
            youtubeCookie: this.cookies(),
            ytdlOptions: {
                quality: 'highestaudio',
                filter: 'audioonly',
                dlChunkSize: 25000,
                highWaterMark: 1024
            },
            nsfw: true // Being handled on a per guild basis, not client-wide.
        });
        this.vc = this.player.voices; // @discordjs/voice
        this.player.sudoAccess = [];

        // Create Command Handler
        this.commands = new CommandHandler(this, {
            directory: './src/commands',
            prefix: message => {
                // This is an attempt to have custom prefixes, despite how Enmap likes to complain.
                // If no key is found, this should return the configured prefix in the .env file.
                if (message.channel.type === ChannelType.DM) {
                    return process.env.PREFIX;
                } else {
                    this.settings.ensure(message.guild.id, this.defaultSettings); // Hoping that the bot doesn't have a panic attack.
                    try {
                        return [this.settings.get(message.guild.id, 'prefix'), process.env.PREFIX] ?? process.env.PREFIX;
                    } catch {
                        return process.env.PREFIX;
                    }
                }
            },
            commandUtil: true,
            handleEdits: true,
            allowMention: true,
            autoRegisterSlashCommands: false,
            autoDefer: false,
            execSlash: true
        });

        // Create Listener Handler
        this.listeners = new ListenerHandler(this, {
            directory: './src/listeners'
        });

        // Create Inhibitor Handler
        this.inhibitors = new InhibitorHandler(this, {
            directory: './src/inhibitors'
        });

        this.creator = new SlashCreator({
            token: process.env.TOKEN,
            applicationID: process.env.APP_ID,
            publicKey: process.env.PUBLIC_KEY,
            client: this,
            disableTimeouts: true,
            unknownCommandResponse: false
        });

        // Gateway Server
        this.creator.withServer(
            new GatewayServer(
                (handler) => this.ws.on('INTERACTION_CREATE', handler)
            )
        );

        // Set custom emitters
        this.listeners.setEmitters({
            process,
            commandHandler: this.commands,
            player: this.player,
            creator: this.creator
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

    /**
     * Logs the client into Discord.
     * @param {string} token Your bot's token.
     */
    async login (token) {
        try {
            return await super.login(token);
        } catch {
            logger.error('An invalid token was provided. Please provide your bot\'s token in the TOKEN environment variable. Learn more: https://200percentmicky.github.io/chadmusic/setup/configuration');
            process.exit(1);
        }
    }

    /**
     * Logs the client off Discord and destorys the client.
     * @param {Number} exitCode Exit code for process exit. Default is 0
     */
    async die (exitCode = 0) {
        logger.warn('Shutting down...');
        this.creator.cleanRegisteredComponents();
        this.destroy();
        process.exitCode = 0;
    }
}

if (process.env.SHARDING) {
    try {
        new ChadMusic().login(process.env.TOKEN);
    } catch (err) {
        logger.fatal(`ChadMusic failed to start! :(\n${err.stack}`);
        process.exit(1);
    }
}

module.exports = ChadMusic;
