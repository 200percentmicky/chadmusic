/// ChadMusic - The Chad Music Bot
/// Copyright (C) 2023  Micky D. | @200percentmicky | Micky-kun#3836
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
const { ChannelType, GatewayIntentBits, Partials } = require('discord.js');
const { SlashCreator, GatewayServer } = require('slash-create');
const DisTube = require('distube').default;
const ytdl = require('@distube/ytdl-core');
const { getRandomIPv6 } = require('@distube/ytdl-core/lib/utils.js');
const { SpotifyPlugin } = require('@distube/spotify');
const { YtDlpPlugin } = require('@distube/yt-dlp');
const Enmap = require('enmap');
const ChadUI = require('./modules/ChadUI');
const ChadUtils = require('./modules/ChadUtils');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const buildNumber = execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).toString().trim();

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
            ]
        });

        // Calling packages that can be used throughout the client.
        this.logger = logger;
        this.ui = ChadUI;
        this.utils = ChadUtils;
        this.extraUtils = require('bot-utils');
        this.buildNumber = buildNumber;

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

        this.agent = () => {
            try {
                return ytdl.createProxyAgent(undefined, {
                    localAddress: getRandomIPv6(process.env.IPV6_BLOCK)
                });
            } catch {
                return undefined;
            }
        };

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
            emitNewSongOnly: this.settings.get('global', 'emitNewSongOnly') ?? true,
            emptyCooldown: this.settings.get('global', 'emptyCooldown') ?? 60,
            leaveOnStop: false, // this.settings.get('global', 'leaveOnStop') ?? true,
            leaveOnEmpty: false, // this.settings.get('global', 'leaveOnEmpty') ?? true,
            leaveOnFinish: false, // this.settings.get('global', 'leaveOnFinish') ?? true,
            streamType: this.settings.get('global', 'streamType') ?? 0,
            youtubeCookie: this.cookies(),
            ytdlOptions: {
                quality: 'highestaudio',
                filter: 'audioonly',
                dlChunkSize: 25000,
                highWaterMark: 1024,
                agent: this.agent()
            },
            nsfw: true // Being handled on a per guild basis, not client-wide.
        });
        this.vc = this.player.voices; // @discordjs/voice

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

        // Register commands in the "commands" directory.
        this.creator.registerCommandsIn(path.join(__dirname, 'appcommands'));
        this.creator.syncCommands({ // Sync all commands with Discord.
            deleteCommands: process.env.DELETE_INVALID_COMMANDS === 'true' || false,
            skipGuildErrors: true,
            syncGuilds: true,
            syncPermissions: true
        });

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

    async login (token) {
        try {
            return await super.login(token);
        } catch {
            logger.error('An invalid token was provided. Please provide your bot\'s token in the TOKEN environment variable. Learn more: https://200percentmicky.github.io/chadmusic/setup/configuration');
            process.exit(1);
        }
    }
}

if (process.env.SHARDING) {
    try {
        new ChadMusic().login(process.env.TOKEN);
    } catch (err) {
        logger.error(`ChadMusic failed to start! :(\n${err.stack}`);
        process.exit(1);
    }
}

module.exports = ChadMusic;
