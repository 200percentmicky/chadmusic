# Commands

These are all of the commands available to the bot, including their corresponding slash commands. All commands listed here will use a `!` to represent a prefix. When running any command, replace `!` with your bot's prefix. Some commands are only available as a slash command and will be designated with a `/`.

## Core

### `!about`
**Slash Command:** `/core about`

Displays information about the bot.


### `!eval <code>`
**Slash Command:** `/core owner eval`

Executes Javascript code.

`<code>` The code to execute.

The following variables will always be available when running the command:
- `Discord` - discord.js
- `_` - lodash
- `__` - underscore
- `prettyBytes` - pretty-bytes
- `prettyMs` - prettyMs
- `colonNotation` - colon-notation
- `commonTags` - common-tags
- `Genius` - genius-lyrics`

!> **Eval can be harmful!** The command is disabled by default. If you need to use this command, you can enable it through the bot's environment variables by setting **USE_EVAL** to `true`. Do not enable this command unless you know what you're doing. If someone is telling you to enable it to have you run something, you're most likely being scammed!

!> Bot owner only.

### `!help [command]`
Displays available commands and how to use them.

`[command]` The command you want to know more about. Shows you how to use its syntax and what permissions it requires.

### `!license`
**Slash Command:** `/core license`

View this program\'s license.

### `!ping`
**Slash Command:** `/core ping`

Shows the bot\'s latency.

### `!reload [reload_slash]`
**Slash Command:** `/core owner reload`

Reloads commands.

`[reload_slash]` Whether to reload the application\'s slash commands. Either `true` or `false`. Default is `false`.

!> Bot owner only.

### `!setgame [type] <status>`
Sets the bot's playing status.

`[type]` The type of status to set. Default is `playing`.

`<status>` The overall status for the bot to use.

!> Bot owner only.

### `!shutdown [reason]`
**Slash Command:** `/core owner shutdown`

Shuts down the bot.

`[reason]` The reason for shutting down the bot.

!> Bot owner only.

## Filters

?> The commands in this category will only be available to DJs if **Allow Filters** is off.

### `!bassboost <gain>`
**Slash Command:** `/filter bassboost`

Boosts the bass of the player.

`<gain>` The gain of the bass boost. Must be between `1-100` or `off`.

### `!crusher <sample> [bits] [mode]`
**Slash Command:** `/filter crusher`

Crushes the audio without changing the bit depth. Makes it sound more harsh and "digital".

`<sample>` The sample reduction. Must be between `1-250` or `off`.

`[bits]` The bit reduction. Must be between 1-64. Default is `8`.

`[mode]` Changes logarithmic mode to either linear (lin) or logarithmic (log). Default is `lin`.

### `!crystalize <intensity>`
**Slash Command:** `/filter crystalize`

Sharpens or softens the audio quality.

`<intensity>` The intensity of the effect. Must be between `-10` to `10` or `off`.

### `!customfilter <argument>`
**Slash Command:** `/filter customfilter`

`<argument>` The filter argument to provide to FFMPEG.

!> If the argument is invalid or not supported by FFMPEG, the stream will prematurely end.

!> Bot owner only.

### `/filter remove <filter>`

?> This command is only available as a slash command.

Remove some or all filters active on the player.

`<filter>` The filter to remove from the player.

### `!filteroff`
**Slash Command:** `/filter remove filter:all`

Removes all filters from the player.

### `!pitch <rate>`
**Slash Command:** `/filter pitch`

Changes the pitch of the playing track.

`<rate>` The rate to change. Must be between `0.1-10` or `off`.

### `!reverse [off]`
**Slash Command:** `/filter reverse`

Plays the track in reverse.

`[off]` Turns off reverse if its active. Only accepts `off` as a value.

### `!tempo <rate>`
**Slash Command:** `/filter tempo`

Changes the tempo of the playing track.

`<rate>` The rate to change. Must be between `0.1-10` or `off`.

### `!tremolo <depth> [frequency]`
**Slash Command:** `/filter tremolo`

Adds a tremolo effect to the player.

`<depth>` The depth of the tremolo. Must be between `0.1-1` or `off`.
`[frequency]` The frequency of the tremolo. Minimum value is `0.1`.

### `!vibrato <depth> [frequency]`
**Slash Command:** `/filter vibrato`

Adds a vibrato effect to the player.

`<depth>` The depth of the vibrato. Must be between `0.1-1` or `off`.
`[frequency]` The frequency of the vibrato. Minimum value is `0.1`.

## Music

### `!bindchannel [channel]`
**Slash Command:** `/player bindchannel`

Changes the player's currently binded text or voice channel to a different one.

`[channel]` The new channel to bind the player to. If nothing was provided, binds to the channel that the command was used in.

?> Requires DJ permissions.

### `!clearqueue`
**Slash Command:** `/queue clear`

Clears the player's queue for this server.

?> Requires DJ permissions if 2 or more people are present.

### `!disconnect`
**Slash Command:** `/player leave`

Disconnects from the current voice channel.

?> Requires DJ permissions if 2 or more people are present.

### `!earrape`
**Slash Command:** `/player earrape`

Changes the volume of the player to 69420%. The ratio that no man can withstand.

?> This command is only usable while **Free Volume** is enabled.

!> Hearing loss or damage to your equipment can occur if the player's volume is set above 200%!

### `!forceskip`
**Slash Command:** `/skip force`

Force skips the currently playing song, bypassing votes.

?> Requires DJ permissions if 2 or more people are present.

### `!grab`
**Slash Command:** `/player grab`

Saves this song to your DMs.

?> This command is always available during DJ mode.

### `!iheartradio <station>`
**Slash Command:** `/play radio iheartradio`

Play a iHeartRadio station.

`<search>` The station to search for. The first result is queued.

### `!lyrics [query]`
**Slash Command:** `/player lyrics`

Retrieves lyrics from the playing track or from search query.

`[query]` The search query to find lyrics. If nothing is provided, uses the currently playing track.

?> This command can be used without the player being active.

### `!nowplaying`
**Slash Command:** `/player nowplaying`

Shows the currently playing track.

### `!pause`
**Slash Command:** `/player pause`

Pauses the player.

?> Requires DJ permissions if 2 or more people are present.

### `!play <url/search/attachment>`
**Slash Commands:** `/play track` and `/play attachment`

`<url/search/attachment>` The URL or search term to load. Also support audio and video attachments.

### `!playnow <url/search/attachment>`
**Slash Command:** `/play now`

Plays a song regardless if there is anything currently playing.

`<url/search/attachment>` The URL or search term to load. Also support audio and video attachments.

?> Requires DJ permissions if 2 or more people are present.

### `/play silently <query>`

?> This command is only available as a slash command.

`<query>` The track to silently play.

### `!queue`
**Slash Command:** `/queue now`

View the queue for this server.

`[show_hidden]` (Slash command only) Reveals silently added tracks. You can reveal your tracks, or show all tracks hidden.

?> Requires DJ permissions if showing all hidden tracks.

### `!remove <queue_entry/start> [end]`
**Slash Command:** `/queue remove`

Removes an entry or multiple entries from the queue.

`<queue_entry/start>` The queue entry to remove from the queue, or the starting position.

`[end]` The end position for removing multiple entries. Every entry from the starting to end position will be removed from the queue

?> Requires DJ permissions if 2 or more people are present.

### `!repeat [mode]`
**Slash Command:** `/player repeat`

Toggles repeat mode for the player.

`[mode]` The mode to apply for repeat mode. Valid options are **off**, **song**, or **queue**. Default is **song**.

?> Requires DJ permissions if 2 or more people are present.

### `!resume`
**Slash Command:** `/player resume`

Unpauses the player, resuming playback.

?> Requires DJ permissions if 2 or more people are present.

### `!reversequeue`
**Slash Command:** `/queue reverse`

Reverses the order of the queue.

?> Requires DJ permissions if 2 or more people are present.

### `!search <query>`
**Slash Command:** `/search`

Searches for a track to play.

`<query>` The query to search for.

### `!seek <time>`
**Slash Command:** `/player seek`

Sets the playing time of the track to a new position.

`<time>` The time of the track to seek to in colon notation or in milliseconds.

?> Requires DJ permissions if 2 or more people are present.

### `!shuffle`
**Slash Command:** `/queue shuffle`

Randomizes the entries in the queue.

?> Requires DJ permissions if 2 or more people are present.

### `!skip`
**Slash Command:** `/skip track`

Skips the currently playing song, or vote to skip the track if the voice channel has more than 3 people. The track will skip if the required number of votes has been reached.

### `!skipto <queue_entry>`
**Slash Command:** `/skip jump`

Skips to the specified entry in the queue.

`<queue_entry>` The number of the queue entry to skip to. Skips all other entries of the queue.

?> Requires DJ permissions if 2 or more people are present.

### `!startover`
**Slash Command:** `/player startover`

Restarts the currently playing song.

?> Requires DJ permissions if 2 or more people are present.

### `!stop`
**Slash Command:** `/player stop`

Destroys the player.

?> Requires DJ permissions if 2 or more people are present.

### `!summon`
**Slash Command:** `/player join`

Summons the bot to a voice channel.

### `!volume [number]`
**Slash Commands:** `/player volume view` and `/player volume set`

Changes the volume of the player.

`[number]` The percentage of the new volume to set. If nothing is provided, shows the current volume of the player. This argument is required when using `/player volume set`.

?> If **Free Volume** is disabled, the maximum value allowed is 200%.

!> Hearing loss or damage to your equipment can occur if the player's volume is set above 200%!
