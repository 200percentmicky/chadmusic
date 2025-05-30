# Environment Variables
This page lists all possible environment variables that you can use to configure how ChadMusic operates globally. Bundled along with the bot is a pre-configured `.env.example` with all avaliable variables for your convenience. After editing the `.env.example` file, you can then rename the file to `.env` so the bot can use the configurations you set. Understand that changing any of the variables in the `.env` file while the bot is online will not immediately apply until the bot is restarted.

In the case where you want to create your own `.env` file instead of using the `.env.example` file, provided below are all the variables that are available. The bot's user interface can also be modified to your liking. If you want to change the bot's user interface, please go to **[Configuration > Customization](customization.md)** for all variables associated with the bot's user interface.

## Client Configuration
These fields are used to configure the bot.

### TOKEN
<span class="badge-warn">:warning: This field is required.</span>

Your bot's token.

### PREFIX

The default prefix for your bot to respond to. Does not apply to slash commands.

!!! info

    If no prefix is provided, then your bot's mention will be used as a prefix instead.

### APP_ID
<span class="badge-warn">:warning: This field is required.</span>

Your application's user ID. This is needed to sync any slash commands on your bot to Discord.

### PUBLIC_KEY

Your application's public key. This is also needed to sync any slash commands on your bot to Discord. Your bot's public key and can be fetched from your app's developer page.

### OWNER_ID
<span class="badge-danger">:x: This field is deprecated.</span>

The bot owner's user ID.

### IPV6_BLOCK

A IPv6 range block address for IP rotation. If you have a IPv6 range, you can use it in this field. This will alleviate the need for a cookie. If you do not know how to use this field, or you don't have an active IPv6 range added to your host, you can leave this field empty and provide a cookie instead.

!!! info

    An address with a prefix size of `/64` is recommended, and is usually the most common address assigned by many hosting providers.

### PROXY

The URL or IP address used to connect to a proxy server.

### FFMPEG_PATH

The filepath that contains an FFmpeg executable. If this field is not set or the specified filepath does not contain an FFmpeg executable, then the bot will use your operating system's PATH variable instead, assuming that FFmpeg was installed to the system correctly and is defined in PATH.

## Sharding
These fields are used to enable sharding support for your bot.

### SHARDING

Enables sharding the bot. This should only be used for large bots that are in over 2500 guilds. When enabled, you must send a SIGINT signal if you want to completely shut down the bot. Using the shutdown command restarts all shards instead.

!!! info

    Sharding the bot isn't necessary until your bot reaches 2500 guilds.

### SHARDS
<span class="badge-warn">:warning: Requires [SHARDING](#sharding-1) variable.</span>

The number of shards to use. This splits the bot into multiple processes to ease the load of a single shard. Disable to have the bot spawn shards automatically.

### SHARDS_PER_CLUSTER
<span class="badge-warn">:warning: Requires [SHARDING](#sharding-1) variable.</span>

The number of shards that a single cluster will utilize. Clusters are shards that spawn their own internal shards to reduce memory usage. [Learn more](https://github.com/meister03/discord-hybrid-sharding?tab=readme-ov-file#how-does-it-work)

## Plugins
These variables are used for certain plugins.

### GENIUS_TOKEN

The token to access Genius API for song lyrics. If this variable is unused, scraping will be used instead.

### SOUNDCLOUD_CLIENT_ID

Your SoundCloud account's client ID.

### SOUNDCLOUD_OAUTH_TOKEN

Your SoundCloud account's OAuth token.

### SPOTIFY_CLIENT_ID

Your Spotify application's client ID.

### SPOTIFY_CLIENT_SECRET

Your Spotify application's client secret key.

### SPOTIFY_TOP_TRACKS_COUNTRY

The country to use for the top artist tracks. Default is `US`. Country code must use the [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-2) standard.

### SPOTIFY_EMIT_EVENTS_AFTER_FETCHING
<span class="badge-danger">:x: This field is deprecated.</span>

For Spotify playlists, this field dictates whether the bot should run player events after fetching all songs in a playlist or not. This field is disabled, or `false` by default. Set to `true` to enable this field.

### SPOTIFY_PARALLEL
<span class="badge-danger">:x: This field is deprecated.</span>

For Spotify, this field dictates whether the bot should search for all tracks in parallel or not. This field is enabled by default. If searching in parallel, the bot will search for all tracks at the same time. If this field is disabled, then all tracks will be searched one link at a time.

### USE_YOUTUBE_PLUGIN

Toggles the use of the [YouTube Plugin](https://www.npmjs.com/package/@distube/youtube). This plugin is not needed for YouTube support. This toggle simply changes how YouTube tracks are extracted. If this plugin is set to `false`, any tracks from YouTube will be resolved through yt-dlp instead.

!!! bug

    Tracks will resolve slower and playlists will not work when this variable is set to false. This is a known issue.

### UPDATE_YTDLP
<span class="badge-info">:information_source: This field was previously UPDATE_YOUTUBE_DL.</span>

Allows the bot to download the most recent build of yt-dlp on boot. Defaults to `true`. If you use a custom build of yt-dlp, enabling this variable is not recommended.

## Development
This section allows you to enable features of the bot for debugging and development purposes, such as enabling the eval command. If you don't know how to use any of the development tools, you should probably keep them disabled for the time being.

### DEV_GUILD
The guild's ID. Enabling this will turn the bot's slash commands into guild commands for the specified guild. Set to `false` to make the commands global.

### USE_EVAL
Enables the `eval` command.

!!! danger "With great power comes great responsibility!"

    Eval can be dangerous if used improperly! You should not enable this variable, unless you know exactly what you're doing. If someone is telling you to enable the eval command to run a script, this will most likely compromise the security of your Discord bot!

### USE_CONSOLE
Allows the bot to log to the console window.

### DEBUG_LOGGING
Enables debug logging.

### FFMPEG_DEBUG_LOGGING
<span class="badge-warn">:warning: Requires [DEBUG_LOGGING](#debug_logging) variable.</span>

Enables Ffmpeg debug logging.

### DELETE_INVALID_COMMANDS
Deletes any slash commands that are no longer valid to the bot. Do not use this variable if you have multiple programs controlling one bot account.

### BUG_CHANNEL
Allows the bot to send any important system messages to the specified channel ID. If no valid channel ID is provided or left blank, system messages will be sent to the application owner instead. If this field is set to `false`, this will disable system messages.