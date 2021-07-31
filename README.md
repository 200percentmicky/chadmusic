<p align="center">
    <img align="center" width="200" height="200" src="https://images-ext-2.discordapp.net/external/E9HLR2Sflz6AA8Pv2Q4TtSD-lDUrN2ZNu3VN5jlXscs/https/media.discordapp.net/attachments/375453081631981568/808626634210410506/deejaytreefiddy.png">
</p>

# ChadMusic - The Chad Music Bot


![GitHub](https://img.shields.io/github/license/mickykun-ar/ChadMusicPlus)
[![Discord](https://img.shields.io/discord/449606846697963531.svg?label=&logo=discord&logoColor=ffffff&color=7389D8&labelColor=6A7EC2)](https://discord.gg/qQuJ9YQ)  
[![forthebadge](https://forthebadge.com/images/badges/made-with-javascript.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/0-percent-optimized.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/fuck-it-ship-it.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/mom-made-pizza-rolls.svg)](https://forthebadge.com)

ChadMusic is a feature-rich badass Discord music bot for your badass Discord server based on a forked build of **[DisTube.js](https://distube.js.org)**.

### Wanna try it out? **[Add my bot to your server!](https://discord.com/api/oauth2/authorize?client_id=375450533114413056&permissions=1005972566&scope=applications.commands%20bot)**

## ✨ Features
* Supports up to 700+ websites.
* Add multiple filters to the player.
* Alter filter values during playback.
* Unlimited volume! 😂👌
* DJ commands to control the player.
* Queue and track length limits.
* And more to come!

## Commands
`Command|Alias <[arguments]>`  
`[]` = Optional  
`<>` = Required  

### Player
* `disconnect|leave|pissoff|fuckoff` - Disconnects the bot from the current voice channel.
* `earrape` - Sets the volume of the player to 42069%
* `grab|save` - Sends the currently playing song to your DMs.
* `nowplaying|np` - Shows whats currently playing in the voice channel.
* `play|p <url|search>` - Plays a track by a URL or a search term. First result will be added to the queue.
* `playnow|pn <url|search>` - Skips the currently playing song for the track provided.
* `queue|q` - Shows the current queue for the server.
* `repeat|loop <mode>` - Enables repeat for the track or for the queue.
* `search <term>` - Searches YouTube for the provided search term.
* `seek <time>` - Sets the playing time of the track to a new position.
* `shuffle` - Randomizes the entries in the queue.
* `skip|s [--force|-f]` - Skips the currently playing track.
* `stop` - Stops the player and clears the queue.
* `summon|join` - Summons the bot to a voice channel.
* `volume|vol <number>` - Changes the volume of the player.

### Filters
* `bassboost|bass <gain:int>` - Boosts the bass of the player.
* `customfilter|cf <argument:str>` - [Bot Owner Only] Allows you to add a custom FFMPEG filter to the player.
* `filteroff|filtersoff|foff` - Removes all filters from the player.
* `reverse [off]` - Plays the music in reverse.
* `tempo <rate:int[1-20]>` - Changes the tempo of the player.
* `tremolo <depth:int(0.1-1)/off> [frequency:int]` - Adds a tremolo effect to the player.
* `vibrato <depth:int(0.1-1)/off> [frequency:int]` - Adds a vibrato effect to the player.

### Settings
* `allowfilters <toggle:all/dj>` - Toggles the ability to allow members to apply filters to the player.
* `djmode <toggle:on/off>` - Toggles DJ Mode for the server.
* `freevolume <toggle:on/off>` - Toggles the ability to change the volume past 200%.
* `maxtime <duration|0/none/off>` - Allows you to restrict songs from being added to the queue if the duration of the video exceeds this.
* `settings` - Shows you the current settings for this server.
* `prefix [prefix]` - Changes the bot's prefix for commands in this server.
* `setdj [role|none/off]` - Sets the DJ Role for this server.
* `setqueuelimit <number|0/none>` - Limits the number of entries that members can add to the queue.

### Utilities
* `about` - Shows information about the bot.
* `eval <code>` - [Bot Owner Only] Executes Javascript code.
* `help [command]` - Shows you all commands as well as documentation for the command if one is provided.
* `ping` - Pong! Returns the bot's connection latency in milliseconds.
* `restart` - [Bot Owner Only] Attempts to restart the bot.
* `sysinfo` - Returns the bot's system information.
* `test` - Test command. It doesn't really do anything.


# All of this looks cool! Can I self host this?
Self-hosting ChadMusic is not supported, but I will not stop you from doing so as long as you abide by the MIT License. Since this bot is based on **[DisTube.js](https://distube.js.org)**, I encourage you to learn how to build your own music bot to your taste. If any of this seems scary to you, again you can always **[add this bot to your server.](https://discord.com/api/oauth2/authorize?client_id=375450533114413056&permissions=1005972566&scope=applications.commands%20bot)**

## Directions
The bot requires Node.JS 14.0.0 to run.
1. Clone this repo.
2. Create a bot application **[here](https://discord.com/developers)**, and copy the bot's token.
3. Fill out the `.env.example` file and rename it to `.env`
4. Type `npm install` in the bot's directory to install all of its dependencies.
5. Run `node index` to run the bot. (Consider using a process manager like PM2 to keep it running in the background.)

