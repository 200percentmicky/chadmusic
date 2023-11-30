# Configuring the bot
The bot utilizes environment variables for its configuration. The bot comes bundled with a `.env.example` that you can fill out. Once you're finished editing the file, rename it to `.env` so the bot can read and save that configuration during boot. If for any reason the values were changed while the bot is online, a reboot is necessary for the changes to take effect.

Below are all the variables that are used in case you want to make your own `.env` file instead.

## Client Configuration

### TOKEN

??? warning "This field is required."

    For the bot to function, this field must be used.

Your bot's token.

### PREFIX

The default prefix for your bot to respond to. Does not apply to slash commands.

!!! info

    If no prefix is provided, then your bot's mention will be used as a prefix instead.

### OWNER_ID
Your user ID. This is the unique ID that is attached to your Discord account and can only be retrieved by using developer mode. You must provide this for the bot to recognize you as the owner.

### APP_ID

??? warning "This field is required."

    For the bot to function, this field must be used.

Your application's user ID. This is needed to sync any slash commands on your bot to Discord.

### PUBLIC_KEY

??? warning "This field is required."

    For the bot to function, this field must be used.

Your application's public key. This is also needed to sync any slash commands on your bot to Discord. Your bot's public key and can be fetched from your app's developer page.

### SHARDING

!!! info

    Sharding the bot isn't necessary until your bot reaches 2500 guilds.

Enables sharding the bot. This should only be used for large bots that are in over 2500 guilds. When enabled, you must send a SIGINT signal if you want to completely shut down the bot. Using the shutdown command restarts all shards instead.

### SHARDS

!!! info

    SHARDING must be set to true for this variable to work.

The number of shards to use. This splits the bot into multiple processes to ease the load of a single shard. Disable to have the bot spawn shards automatically.

## Player Configuration

### YOUTUBE_COOKIE

!!! failure "This field is deprecated."

    This field has been deprecated in favor of the new cookie system intrduced in 2023.5.0 and will be removed in the future. Please read the [**Adding Cookies**](#adding-cookies) section below for more information.

The cookie to use from YouTube. This is optional but recommended to use. To learn how to get a cookie header, you can look at the example from [here](https://github.com/fent/node-ytdl-core/blob/997efdd5dd9063363f6ef668bb364e83970756e7/example/cookies.js#L6-L12). It tells you how to get the cookie header. Once you have what you need, paste the entire content in this variable.

### IPV6_BLOCK
A IPv6 range block address for IP rotation. If you have a IPv6 range, you can use it in this field. This will alleviate the need for a cookie. If you do not know how to use this field, or you don't have an active IPv6 range added to your host, you can leave this field empty and provide a cookie instead.

!!! info

    An address with a prefix size of `/64` is recommended, and is usually the most common address assigned by many hosting providers.

### USE_YOUTUBE_DL
Enables youtube-dl. Set to `true` to allow the bot to use any website supported by youtube-dl. Defaults to `true`.

### UPDATE_YOUTUBE_DL
Allows the bot to download the most recent build of youtube-dl on boot. Defaults to `true`. Do not use this variable if you utilize a custom build.

### SPOTIFY_EMIT_EVENTS_AFTER_FETCHING
For Spotify playlists, this field dictates whether the bot should run player events after fetching all songs in a playlist or not. This field is disabled, or `false` by default. Set to `true` to enable this field.

### SPOTIFY_PARALLEL
For Spotify, this field dictates whether the bot should search for all tracks in parallel or not. This field is enabled by default. If searching in parallel, the bot will search for all tracks at the same time. If this field is disabled, then all tracks will be searched one link at a time.

### GENIUS_TOKEN
The token to access Genius API for song lyrics. If this variable is unused, scraping will be used instead.

## Development

### DEV_GUILD
The guild's ID. Enabling this will turn the bot's commands into guild commands for the specified guild. Do not use this varibale to make the commands global.

### USE_EVAL

!!! danger "Eval can be harmful!"

    Eval can be dangerous if used improperly! Do not enable this variable if you don't know what you're doing. If someone is telling you to enable it to have you evaluate a script, you're most likely being scammed! If you do know what you're doing and want to enable this variable, set this variable to **true**.

Enables the `eval` command. With great power comes great responsibility.

### USE_CONSOLE
Allows the bot to log to the console window.

### DEBUG_LOGGING
Enables debug logging. Useful for reporting bugs.

### DELETE_INVALID_COMMANDS
Deletes any slash commands that are no longer valid to the bot. Do not use this variable if you have multiple programs controlling one bot account.

## Adding Cookies
Starting in 2023.5.0, a new cookie system has been implemented replacing the `YOUTUBE_COOKIE` variable. This method should be easier to implement for your use case, but is completely optional. ALso, with the new cookie system, you're not just limited to one cookie. The new system will allow you to use more than one cookie! You can learn more on how to use the new cookie system by following the guide below.

[Using cookies](https://distube.js.org/#/docs/DisTube/main/general/cookie){ .md-button }

By completing the guide for the new cookie system, you should now have the generated cookie, or multiple cookies if you have more than one. You will need to add them all to the `cookies.json` file located within the root directory of your bot.