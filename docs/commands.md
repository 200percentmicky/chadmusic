# Commands

These are all of the commands available to the bot, including their aliases and corresponding slash commands.

!!! quote "Legend"

    * Commands are formatted as `[p]prefix | [p]alias | /slash command <arguments>`
    * `[p]` is your bot's prefix.
    * Arguments surrounded in `<>` are required.
    * Arguments surrounded in `[]` are optional. 
    * Argument surrounded in quotation marks (e.g. <"name">) must use quotation marks! This only applies to prefix commands, not slash commands

## Core
Commands related to core functionality of the bot.

### [p]about | /core about

Displays information about the bot.

### [p]eval | /core owner eval `<code>`
<span class="badge-danger">:no_entry_sign: Bot owner only<span>

Executes Javascript code.

| Arguments | Type | Description          |
| --------- | ---- | -------------------- |
| `<code>`  | string | The code to execute. |

The following variables will always be available when running the command:

* `Discord` - discord.js
* `player` - Active player in the server, if any.
* `queue` - Queue of active player, if any.
* `message` - Message object (Prefix command only.)
* `ctx` - Command context (Slash command only.)
* `_` - lodash
* `prettyBytes` - pretty-bytes
* `prettyMs` - prettyMs
* `colonNotation` - colon-notation
* `commonTags` - common-tags
* `Genius` - genius-lyrics

!!! danger "With great power comes great responsibility!"

    Eval can be dangerous if used improperly! The command is disabled by default, but you can enable it through the bot's environment variables by setting **USE_EVAL** to `true`. Do not enable this command unless you know exactly what you're doing. If someone is telling you to enable the eval command to run a script, this will most likely compromise the security of your Discord bot!

### [p]help `[command]`
<span class="badge-info">:information_source: Prefix command only</span>

Displays available commands and how to use them.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `[command]` | string | The command you want to know more about. Shows you how to use its syntax and what permissions it requires. |

### [p]license | /core license

View this program\'s license.

### [p]ping | /core ping

Shows the bot\'s latency.

### [p]reload | /core owner reload `[reload_slash]`
<span class="badge-danger">:no_entry_sign: Bot owner only<span>

Reloads all of the bot's commands and listeners.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `[reload_slash]` | boolean | Whether to reload the application's slash commands. Either `true` or `false`. Default is `false`. |

### [p]setavatar | /core owner setavatar `<image> [url]`
<span class="badge-danger">:no_entry_sign: Bot owner only<span>

Changes the bot's avatar. If no arguments are provided, removes the avatar.

| Arguments  | Type | Description |
| ---------- | ---- | ----------- |
| `<image>` | Attachment | The attached image to use for the avatar. Supports GIF, JPEG, or PNG formats. |
| `[url]` | string | The URL of an image to use for the avatar. Supports GIF, JPEG, or PNG formats. |

### [p]setbanner | /core owner setbanner `<image> [url]`
<span class="badge-danger">:no_entry_sign: Bot owner only<span>

Changes the bot's profile banner. If no arguments are provided, removes the banner.

| Arguments  | Type | Description |
| ---------- | ---- | ----------- |
| `<image>` | Attachment | The attached image to use for the banner. Supports GIF, JPEG, or PNG formats. |
| `[url]` | string | The URL of an image to use for the avatar. Supports GIF, JPEG, or PNG formats. |

### [p]setgame | /core owner setgame `[type] <status>`
<span class="badge-danger">:no_entry_sign: Bot owner only<span>

Changes the bot's playing status.

Available types are `playing`, `watching`, `listening`, `custom`, and `competing`.

| Arguments  | Type | Description |
| ---------- | ---- | ----------- |
| `[type]`   | string | The type of status to set. Default is `custom`. |
| `<status>` | string | The overall status for the bot to use. |

### [p]shutdown | /core owner shutdown `[reason]`
<span class="badge-danger">:no_entry_sign: Bot owner only<span>

Shuts down the bot.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `[reason]` | string | The reason for shutting down the bot. |

### [p]sudo | /core owner sudo
<span class="badge-danger">:no_entry_sign: Bot owner only<span>

Grants or denies the bot owner DJ permissions in the given server.

!!! warning

    Sudo access is per server, not globally. Sudo is also disabled by default and resets everytime the bot restarts.

## Filters
Commands to add or remove filters from the player. The commands in this category will only be available to DJs if **Allow Filters** is off.

### [p]bassboost | [p]bass | /filter bassboost `<gain>`

Boosts the bass of the player.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<gain>` | float | The gain of the bass boost. Must be between `0.01-100` or `off`. |

### [p]crusher | /filter crusher `<sample> [bits] [mode]`

Crushes the audio without changing the bit depth. Makes it sound more harsh and "digital".

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<sample>` | number | The sample reduction. Must be between `1-250` or `off`. |
| `[bits]` | number | The bit reduction. Must be between 1-64. Default is `8`. |
| `[mode]` | string | Changes logarithmic mode to either linear (lin) or logarithmic (log). Default is `lin`. |

### [p]crystalize | /filter crystalize `<intensity>`

Sharpens or softens the audio quality.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<intensity>` | float | The intensity of the effect. Must be between `-10` to `10` or `off`. |

### [p]customfilter | [p]cf | /filter customfilter `<argument>`
<span class="badge-danger">:no_entry_sign: Bot owner only<span>

Adds a custom FFMPEG filter to the player.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<argument>` | string | The filter argument to provide to FFMPEG. |

!!! warning

    If the argument is invalid or not supported by FFMPEG, the stream will prematurely end.

### /filter remove `<filter>`
<span class="badge-info">:information_source: Slash command only<span>

Remove some or all filters active on the player.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<filter>` | string | The filter to remove from the player. |

### [p]filteroff | [p]foff | /filter remove filter:"all"

Removes all filters from the player.

### [p]pitch | /filter pitch `<rate>`

Changes the pitch of the playing track.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<rate>` | float | The rate to change. Must be between `0.1-10` or `off`. |

### [p]pulsator | /filter pulsator `<frequency>`

Adds a pulsating effect to the audio.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<frequency>` | float | The frequency of the effect in Hz. Must be between 0.01-100 or off. |

### [p]reverse | /filter reverse

Plays the track in reverse. Disables if reverse is already enabled.

### [p]tempo | /filter tempo `<rate>`

Changes the tempo of the playing track.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<rate>` | float | The rate to change. Must be between `0.1-10` or `off`. |

### [p]tremolo | /filter tremolo `<depth> [frequency]`

Adds a tremolo effect to the player.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<depth>` | float | The depth of the tremolo. Must be between `0.1-1` or `off`. |
| `[frequency]` | float | The frequency of the tremolo. Minimum value is `0.1`. |

### [p]vibrato | /filter vibrato `<depth> [frequency]`

Adds a vibrato effect to the player.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<depth>` | float | The depth of the tremolo. Must be between `0.1-1` or `off`. |
| `[frequency]` | float | The frequency of the tremolo. Minimum value is `0.1`. |

## Player
The main commands of the audio player.

### Message > Apps > Add to queue
<span class="badge-info">:information_source: Message Context Menu only. [Learn More](https://discord.com/developers/docs/interactions/application-commands#message-commands)</span>

Adds a track to the queue by using the message's content as a search query.

!!! warning

    This command requires the **Message Content** privileged intent to work.

### [p]bindchannel | [p]bindto | /player bindchannel `[channel]`
<span class="badge-info">:musical_note: Requires DJ permissions</span>

Changes the player's currently binded text or voice channel to a different one.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `[channel]` | Text/Voice Channel | The new channel to bind the player to. If nothing was provided, binds to the channel that the command was used in. |

### [p]clearqueue | [p]clear | /queue clear
<span class="badge-info">:notes: DJ permissions required with 2 or more people.</span>

Clears the player's queue for this server.

### [p]disconnect | [p]leave | /player leave
<span class="badge-info">:notes: DJ permissions required with 2 or more people.</span>

Disconnects from the current voice channel.

### [p]earrape | /player earrape

Changes the volume of the player to 69420%. The ratio that no man can withstand.

!!! info

    This command is only usable while **Free Volume** is enabled.

!!! danger

    Hearing loss or damage to your equipment can occur if the player's volume is set above 200%!

### [p]forceskip | [p]fs | /skip force

<span class="badge-info">:musical_note: Requires DJ permissions</span>

Force skips the currently playing song, bypassing votes.

### [p]grab | [p]yoink | /player grab

!!! info

    This command can be used by everyone while **DJ Mode** is active.

Saves the currently playing track to your DMs.

### [p]iheartradio | [p]ihr | /play radio iheartradio `<station>`

Play a iHeartRadio station.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<search>` | string | The station to search for. The first result is queued. |

### [p]lyrics | /player lyrics `[query]`

Retrieves lyrics from the playing track or from search query.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `[query]` | string | The search query to find lyrics. If nothing is provided, uses the currently playing track. |

!!! info

    This command can be used without the player being active.

### [p]move | /queue move `<track>` `[position]`

Moves a track in the queue to a new position.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<track>` | number | The track to move |
| `[position]` | number | The new position in the queue. If omitted, moves the selection to the first position in the queue. |

### [p]nowplaying | [p]np | /player nowplaying

Shows the currently playing track.

### [p]pause | /player pause
<span class="badge-info">:notes: DJ permissions required with 2 or more people.</span>

Pauses the player.

### [p]play | [p]p | /play track | /play attachment `<url/search/attachment>`

Adds a track to the queue from a URL, search query, or an attachment.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<url/search/attachment>` | string or Attachment | The URL, search query, or attachment to load. Only audio and video attachments are supported. |

### [p]playnow | [p]np | /play now `<url/search/attachment>`
<span class="badge-info">:notes: DJ permissions required with 2 or more people.</span>

Adds a track to the queue and skips the currently playing track, if there was a track playing.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<url/search/attachment>` | string or Attachment | The URL, search query, or attachment to load. Only audio and video attachments are supported. |

### /play playlist `<name>`
<span class="badge-info">:information_source: Slash command only</span>

Plays a custom playlist.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<name>` | string | The name of the playlist to play. |

!!! tip

    If you want to play an online playlist, consider using `/play track` or `[p]play` instead. This command is used to load server playlists.

### /play silently `<query>`

<span class="badge-info">:information_source: Slash command only</span>

Plays a track silently. It will not be sent in chat, and will be hidden from others in the queue.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<query>` | string | The track to silently play. |

!!! info

    This command is only available to DJs if **Allow Silent Tracks** is off.

### [p]queue | [p]q | /queue now `[show_hidden]`

View the queue for this server.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `[show_hidden]` | string | (Slash command only) Reveals silently added tracks. You can reveal your tracks, or show all hidden tracks. |

!!! info "Showing all tracks."

    This argument to view all hidden tracks can only be used by DJs.

### [p]remove | /queue remove `<queue_entry/start> [end]`
<span class="badge-info">:notes: DJ permissions required with 2 or more people.</span>

Removes an entry or multiple entries from the queue.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<queue_entry/start>` | number | The queue entry to remove from the queue, or the starting position. |
| `[end]` | number | The end position for removing multiple entries. Every entry from the starting to end position will be removed from the queue. |

### [p]repeat | [p]loop | /player repeat `[mode]`
<span class="badge-info">:notes: DJ permissions required with 2 or more people.</span>

Toggles repeat mode for the player.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `[mode]` | string | The mode to apply for repeat mode. Valid options are **off**, **song**, or **queue**. Default is **song**. |

### [p]resume | /player resume
<span class="badge-info">:notes: DJ permissions required with 2 or more people.</span>

Unpauses the player, resuming playback.

### [p]reversequeue | [p]rq | /queue reverse
<span class="badge-info">:notes: DJ permissions required with 2 or more people.</span>

Reverses the order of the queue.

### [p]search | /search `<query>`

Searches for a track to play.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<query>` | string | The query to search for. |

### [p]seek | /player seek `<time>`
<span class="badge-info">:notes: DJ permissions required with 2 or more people.</span>

Sets the playing time of the track to a new position.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<time>` | number or Notation | The time of the track to seek to in colon notation or in milliseconds. |

### [p]shuffle | /queue shuffle
<span class="badge-info">:notes: DJ permissions required with 2 or more people.</span>

Randomizes the entries in the queue.

### [p]skip | [p]s | /skip track

Skips the currently playing song, or vote to skip the track if the voice channel has more than 3 people. The track will skip if the required number of votes has been reached.

!!! tip

    If you have the **Manage Server** permission, you can change how the number of votes are calculated by using `/settings votepercentage` or `[p]votepercentage`.

### [p]skipto | [p]jump | /skip jump `<queue_entry>`
<span class="badge-info">:notes: DJ permissions required with 2 or more people.</span>

Skips to the specified entry in the queue.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<queue_entry>` | number | The number of the queue entry to skip to. Skips all other entries of the queue. |

### [p]startover | [p]restart | /player startover
<span class="badge-info">:notes: DJ permissions required with 2 or more people.</span>

Restarts the currently playing song.

!!! tip
    
    If the currently playing track is a live stream, this command can be used to refresh the live stream instead.

### [p]stop | /player stop
<span class="badge-info">:notes: DJ permissions required with 2 or more people.</span>

Destroys the player.

### [p]summon | [p]join | /player join

Summons the bot to a voice channel.

### [p]volume | [p]vol | /player volume view/set `[number]`

Views or changes the volume of the player.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `[number]` | number | The percentage of the new volume to set. If nothing is provided, shows the current volume of the player. This argument is required when using `/player volume set`. |

!!! info

    If **Free Volume** is disabled, the maximum value allowed is 200%.

!!! danger

    Hearing loss or damage to your equipment can occur if the player's volume is set above 200%!

## Playlists
Commands used to manage playlists on a server. All commands in this category require DJ permissions.

### [p]playlist-add | [p]pladd | /playlist add `<"name">` `[track]`

Adds a track to a playlist.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<name>` | string | The name of the playlist to add tracks to. |
| `[track]` | URL | A track to add to the playlist. If nothing was provided and a player is currently playing a track, adds the currently playing track to the playlist. |

!!! info

    To add tracks, you must be the user that created the playlist, unless you have the **Administrator** permission.

### [p]playlist-clone | [p]plclone | /playlist clone `<"name">` `["clone_name"]`

Creates a playlist by cloning an existing one.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<name>` | string | The name of the playlist to clone |
| `[clone_name]` | string | The name to give to the cloned playlist. If nothing was provided, affixes "- Copy" to the original name. |

### [p]playlist-delete | [p]pldelete | /playlist delete `<name>`

Deletes a playlist.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<name>` | string | The name of the playlist to delete.

!!! info

    To delete a playlist, you must be the user that created the playlist, unless you have the **Administrator** permission.

### [p]playlist-new | [p]plnew | /playlist new `<name>`

Creates a new playlist.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<name>` | string | The name to give to the new playlist. |

### [p]playlist-purge | [p]plpurge | /playlist purge
<span class="badge-danger">:x: Administrators only</span>

Deletes all playlists on the server.

### [p]playlist-remove | [p]plremove | /playlist remove `<"name">` `<index_or_start>` `[end]`

Removes a track or multiple tracks from a playlist.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<name>` | string | The name of the playlist to remove tracks. |
| `<index_or_start>` | number | The track or the starting position to remove multiple tracks from the playlist. |
| `[end]` | number | The ending position to remove multiple tracks. |

!!! info

    To remove tracks, you must be the user that created the playlist, unless you have the **Administrator** permission.

### [p]playlist-show | [p]plshow | /playlist show

Lists all playlists on the server.

### [p]playlist-view | [p]plview | /playlist view `<name>`

List all tracks in a playlist.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<name>` | string | The name of the playlist to view.

## Settings
Commands to change the bot's settings. All commands in this category require the **Manage Server** permission unless otherwise specified.

### [p]allowexplicit | /settings allowexplicit `<toggle>`

Toggles the ability to allow age restricted content in the queue.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<toggle>` | string or boolean | Toggles the setting. Either `on` or `off`. Default is `on`. |

!!! warning

    This setting only applies to tracks that are marked as explicit. All pornographic websites are blocked regardless if this setting is on or not.

!!! info "Regarding tracks from YouTube."

    If a cookie wasn't provided in `cookies.json`, you'll still be able to use this command. The player won't be able to play any track that's marked explicit without a valid cookie that allows access to age restricted content.

### [p]allowfilters | /settings allowfilters `<toggle>`

Toggles the ability to allow members to apply filters to the player.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<toggle>` | string or boolean | Toggles the setting. Either `on` or `off`. Default is `on`. |

### [p]allowlinks | /settings allowlinks `<toggle>`

Toggles the ability to add songs to the queue from a URL.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<toggle>` | string or boolean | Toggles the setting. Either `on` or `off`. Default is `on`. |

### [p]allowsilenttracks | /settings allowsilenttracks `<toggle>`

Toggles the ability to silently add tracks to the queue.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<toggle>` | string or boolean | Toggles the setting. Either `on` or `off`. Default is `on`. |

### [p]allowyoutube | /settings global allowyoutube `<toggle>`
<span class="badge-danger">:no_entry_sign: Bot owner only</span>

Toggles the ability to allow tracks from YouTube to be added to the player.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<toggle>` | string or boolean | Toggles the setting. Either `on` or `off`. Default is `on`. |

### [p]blocksong add/remove/list | /settings blocksong add/remove/list `<phrase>`

Manages the server's list of blocked search phrases.

| Subcommand | Description |
| ---------- | ----------- |
| add | Adds a phrase to the list. |
| remove | Removes a phrase from the list. |
| list | View the current list for the server. |

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<phrase>` | string | The phrase to add or remove from the list. |

### [p]defaultvolume | /settings defaultvolume `<volume>`

Changes the bot's default volume when creating a player, or when disabling Earrape.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<volume>` | number | The new default volume for the server. Must be between `1` to `200`. Default is `100`. |

### [p]djmode | /settings djmode `<toggle>`

!!! info
    
    DJs can use this command.

Toggles DJ Mode for the server.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<toggle>` | string or boolean | Toggles the setting. Either `on` or `off`. Default is `off`. |

### [p]emptycooldown | /settings emptycooldown `<time>`

Sets how long the bots stays in an empty voice channel.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<time>` | number | The time the bot will stay in seconds. |

!!! info

    This settings only works if **Leave on Empty** is on.

### [p]freevolume | /settings unlimitedvolume `<toggle>`

Toggles the ability to change the volume past 200%.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<toggle>` | string or boolean | Toggles the setting. Either `on` or `off`. Default is `on`. |

### [p]globalsettings | /settings global current
<span class="badge-danger">:no_entry_sign: Bot owner only</span>

Shows the bot's current global settings.

### [p]leaveonempty | /settings leaveonempty `<toggle>`

Toggles whether the bot should leave when the voice channel is empty for a period of time.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<toggle>` | string or boolean | Toggles the setting. Either `on` or `off`. Default is `on`. |

!!! info

    When this is active, the bot will leave depending on how long **Empty Cooldown** is set.

### [p]leaveonfinish | /settings leaveonfinish `<toggle>`

Toggles whether the bot should leave when the end of the queue has been reached.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<toggle>` | string or boolean | Toggles the setting. Either `on` or `off`. Default is `on`. |

### [p]leaveonstop | /settings leaveonstop `<toggle>`

Toggles whether the bot should leave when the player is stopped.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<toggle>` | string or boolean | Toggles the setting. Either `on` or `off`. Default is `on`. |

### [p]maxtime | /settings maxtime `<duration>`

Restrict members from adding tracks to the queue that exceed the duration set.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<duration>` | Notation | The max duration of the track to limit. Members will be unable to add any tracks to the queue that go past this limit. Default is `0`. Set to `0` or `none` to disable. |

### [p]prefix | /settings prefix `[new_prefix]`

Changes the bot's prefix for this server.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `[new_prefix]` | string | The new prefix you want to use. If none was provided, resets the prefix to defaults. |

!!! info

    This setting will only affect message based commands, not slash commands. The default prefix defined in the bot's configuration in addition to the bot's mention will always be available.

### [p]resetdata
<span class="badge-info">:information_source: Prefix command only</span>
<span class="badge-danger">:x: Administrators only</span>

Resets the bot's settings for the server to its default settings.

### /settings remove `<setting>`
<span class="badge-info">:information_source: Slash command only<span>

Revert a setting to its default value.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<setting>` | string | The setting you would like to revert. |

### [p]setdj | /setting djrole `[role]`

Sets the DJ role for the server.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `[role]` | Role | The role you would like to set. Can be the name, the ID, or a mention of the role. If none was provided, removes the DJ role. |

### [p]setqueuelimits | /settings setqueuelimts `<number>`

Limits the number of entries that members can add to the queue.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<number>` | number | The numbers of entries to limit for members. |

### [p]settings | /settings current

Displays the bot's current settings for the server.

### [p]shownewsongonly | /settings global shownewsongonly `<toggle>`
<span class="badge-danger">:no_entry_sign: Bot owner only<span>

Toggles whether the Now Playing alerts are shown for new songs only.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<toggle>` | string or boolean | Toggles the setting. Either `on` or `off`. Default is `on`. |

### [p]songvcstatus | /settings songvcstatus `<toggle>`

Toggles whether the bot will set the playing track's title as a status for the voice channel.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<toggle>` | boolean | The toggle of the setting. |

!!! warning "Experimental"

    This feature uses an undocumented endpoint in Discord's API and may change at anytime.

### [p]streamtype | /settings global streamtype `<encoder>`
<span class="badge-danger">:no_entry_sign: Bot owner only<span>

Selects which audio encoder the bot should use during streams.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<encoder>` | string | The audio encoder to use.|

| Encoder | Description |
| ------- | ----------- |
| opus | Uses the Opus encoder. Better quality, uses more resources. |
| raw | Uses a RAW encoder. Better performance, uses less resources. |

### [p]textchannel | /settings textchannel `[channel]`

Sets the text channel to use for music commands.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `[channel]` | Text/Voice Channel | The text or voice channel to apply. Can be the channel's mention or the channel's ID. If none is provided, all channels will be available. |

### [p]thumbnailsize | /settings thumbnailsize `<size>`

Changes the track's thumbnail size of the player's "Now Playing" embeds.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<size>` | string | The size of the track's image. Either `small` or `large`. Default is `small`. |

### [p]votepercentage | /settings votepercentage `<percentage>`

Changes the vote-skip percentage requirement for placing votes to skip a track.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<percentage>` | float | The percentage to set. Set to 0 to disable, or 100 to require everyone to vote. Default is 50. |