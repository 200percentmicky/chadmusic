# Commands

These are all of the commands available to the bot, including their aliases and corresponding slash commands.

!!! quote "Legend"

    * Arguments surrounded in `<>` are required.
    * Arguments surrounded in `[]` are optional. 
    * Argument surrounded in quotation marks (e.g. <"name">) must use quotation mark! This only applies to prefix commands, not slash commands

!!! note

    All commands shown are formatted as `!prefix | !alias | /slash command <arguments>`.


## Core
Commands related to core functionality of the bot.

### !about | /core about

Displays information about the bot.

### !eval | /core owner eval `<code>`

??? failure "Bot owner only."

    This command is restricted to the owner of the application.

Executes Javascript code.

| Arguments | Type | Description          |
| --------- | ---- | -------------------- |
| `<code>`  | string | The code to execute. |

The following variables will always be available when running the command:

* `Discord` - discord.js
* `_` - lodash
* `prettyBytes` - pretty-bytes
* `prettyMs` - prettyMs
* `colonNotation` - colon-notation
* `commonTags` - common-tags
* `Genius` - genius-lyrics

!!! danger "Eval can be harmful!"

    Eval can be dangerous if used improperly! The command is disabled by default, but you can enable it through the bot's environment variables by setting **USE_EVAL** to `true`. Do not enable this command unless you know what you're doing. If someone is telling you to enable it to have you evaluate a script, you're most likely being scammed!

### !help `[command]`

??? info "Prefix command only."

    This command is only available as a prefix command.

Displays available commands and how to use them.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `[command]` | string | The command you want to know more about. Shows you how to use its syntax and what permissions it requires. |

### !license | /core license

View this program\'s license.

### !ping | /core ping

Shows the bot\'s latency.

### !reload | /core owner reload `[reload_slash]`

??? failure "Bot owner only."

    This command is restricted to the owner of the application.

Reloads all of the bot's commands and listeners.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `[reload_slash]` | boolean | Whether to reload the application's slash commands. Either `true` or `false`. Default is `false`. |

### !setgame `[type] <status>`

??? info "Prefix command only."

    This command is only available as a prefix command.

??? failure "Bot owner only."

    This command is restricted to the owner of the application.

Sets the bot's playing status.

Available types are `playing`, `watching`, `listening`, and `streaming`

| Arguments  | Type | Description |
| ---------- | ---- | ----------- |
| `[type]`   | string | The type of status to set. Default is `playing`. |
| `<status>` | string | The overall status for the bot to use. |

### !shutdown | /core owner shutdown `[reason]`

??? failure "Bot owner only."

    This command is restricted to the owner of the application.

Shuts down the bot.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `[reason]` | string | The reason for shutting down the bot. |

## Filters
Commands to add or remove filters from the player. The commands in this category will only be available to DJs if **Allow Filters** is off.

### !bassboost | !bass | /filter bassboost `<gain>`

Boosts the bass of the player.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<gain>` | number | The gain of the bass boost. Must be between `1-100` or `off`. |

### !crusher | /filter crusher `<sample> [bits] [mode]`

Crushes the audio without changing the bit depth. Makes it sound more harsh and "digital".

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<sample>` | number | The sample reduction. Must be between `1-250` or `off`. |
| `[bits]` | number | The bit reduction. Must be between 1-64. Default is `8`. |
| `[mode]` | string | Changes logarithmic mode to either linear (lin) or logarithmic (log). Default is `lin`. |

### !crystalize | /filter crystalize `<intensity>`

Sharpens or softens the audio quality.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<intensity>` | number | The intensity of the effect. Must be between `-10` to `10` or `off`. |

### !customfilter | !cf | /filter customfilter `<argument>`

??? failure "Bot owner only."

    This command is restricted to the owner of the application.

Adds a custom FFMPEG filter to the player.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<argument>` | string | The filter argument to provide to FFMPEG. |

!!! warning

    If the argument is invalid or not supported by FFMPEG, the stream will prematurely end.

### /filter remove `<filter>`

??? info "Slash command only."

    This command is only available as a slash command.

Remove some or all filters active on the player.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<filter>` | string | The filter to remove from the player. |

### !filteroff | !foff | /filter remove filter:"all"

Removes all filters from the player.

### !pitch | /filter pitch `<rate>`

Changes the pitch of the playing track.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<rate>` | float | The rate to change. Must be between `0.1-10` or `off`. |

### !reverse | /filter reverse

Plays the track in reverse. Disables if reverse is already enabled.

### !tempo | /filter tempo `<rate>`

Changes the tempo of the playing track.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<rate>` | float | The rate to change. Must be between `0.1-10` or `off`. |

### !tremolo | /filter tremolo `<depth> [frequency]`

Adds a tremolo effect to the player.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<depth>` | float | The depth of the tremolo. Must be between `0.1-1` or `off`. |
| `[frequency]` | float | The frequency of the tremolo. Minimum value is `0.1`. |

### !vibrato | /filter vibrato `<depth> [frequency]`

Adds a vibrato effect to the player.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<depth>` | float | The depth of the tremolo. Must be between `0.1-1` or `off`. |
| `[frequency]` | float | The frequency of the tremolo. Minimum value is `0.1`. |

## Player
The main commands of the audio player.

### Message > Apps > Add to queue

??? info "Message Command only"

    This command is only available as a **Message Command** and must be executed from the **Apps** section in a target message's right-click context menu. [Learn More](https://discord.com/developers/docs/interactions/application-commands#message-commands)

!!! warning

    This command requires the **Message Content** privileged intent to work.

Adds a track to the queue by using the message's content as a search query.

### !bindchannel | !bindto | /player bindchannel `[channel]`

!!! info

    This command is only available to DJs.

Changes the player's currently binded text or voice channel to a different one.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `[channel]` | Text/Voice Channel | The new channel to bind the player to. If nothing was provided, binds to the channel that the command was used in. |

### !clearqueue | !clear | /queue clear

??? info "DJs only if not alone."

    This command can only be used by DJs if there are more than 2 people in the voice channel.

Clears the player's queue for this server.

### !disconnect | !leave | /player leave

??? info "DJs only if not alone."

    This command can only be used by DJs if there are more than 2 people in the voice channel.

Disconnects from the current voice channel.

### !earrape | /player earrape

Changes the volume of the player to 69420%. The ratio that no man can withstand.

!!! info

    This command is only usable while **Free Volume** is enabled.

!!! danger

    Hearing loss or damage to your equipment can occur if the player's volume is set above 200%!

### !forceskip | !fs | /skip force

??? info "DJ only."

    This command is only available to DJs.

Force skips the currently playing song, bypassing votes.

### !grab | !yoink | /player grab

!!! info

    This command is always available, even when DJ mode active.

Saves this song to your DMs.

### !iheartradio | !ihr | /play radio iheartradio `<station>`

Play a iHeartRadio station.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<search>` | string | The station to search for. The first result is queued. |

### !lyrics | /player lyrics `[query]`

!!! info

    This command can be used without the player being active.

Retrieves lyrics from the playing track or from search query.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `[query]` | string | The search query to find lyrics. If nothing is provided, uses the currently playing track. |

### !nowplaying | !np | /player nowplaying

Shows the currently playing track.

### !pause | /player pause

??? info "DJs only if not alone."

    This command can only be used by DJs if there are more than 2 people in the voice channel.

Pauses the player.

### !play | !p | /play track | /play attachment `<url/search/attachment>`

Adds a track to the queue from a URL, search query, or an attachment.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<url/search/attachment>` | string or Attachment | The URL, search query, or attachment to load. Only audio and video attachments are supported. |

### !playnow | !np | /play now `<url/search/attachment>`

??? info "DJs only if not alone."

    This command can only be used by DJs if there are more than 2 people in the voice channel.

Adds a track to the queue and skips the currently playing track, if there was a track playing.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<url/search/attachment>` | string or Attachment | The URL, search query, or attachment to load. Only audio and video attachments are supported. |

### /play silently `<query>`

??? info "Slash command only."

    This command is only available as a slash command.

!!! info

    This command is only available to DJs if **Allow Silent Tracks** is off.

Plays a track silently. It will not be sent in chat, and will be hidden from others in the queue.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<query>` | string | The track to silently play. |

### !queue | !q | /queue now `[show_hidden]`

View the queue for this server.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `[show_hidden]` | string | (Slash command only) Reveals silently added tracks. You can reveal your tracks, or show all hidden tracks. |

!!! info "Showing all tracks."

    This argument to view all hidden tracks can only be used by DJs.

### !remove | /queue remove `<queue_entry/start> [end]`

??? info "DJs only if not alone."

    This command can only be used by DJs if there are more than 2 people in the voice channel.

Removes an entry or multiple entries from the queue.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<queue_entry/start>` | number | The queue entry to remove from the queue, or the starting position. |
| `[end]` | number | The end position for removing multiple entries. Every entry from the starting to end position will be removed from the queue. |

### !repeat | !loop | /player repeat `[mode]`

??? info "DJs only if not alone."

    This command can only be used by DJs if there are more than 2 people in the voice channel.

Toggles repeat mode for the player.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `[mode]` | string | The mode to apply for repeat mode. Valid options are **off**, **song**, or **queue**. Default is **song**. |

### !resume | /player resume

??? info "DJs only if not alone."

    This command can only be used by DJs if there are more than 2 people in the voice channel.

Unpauses the player, resuming playback.

### !reversequeue | !rq | /queue reverse

??? info "DJs only if not alone."

    This command can only be used by DJs if there are more than 2 people in the voice channel.

Reverses the order of the queue.

### !search | /search `<query>`

Searches for a track to play.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<query>` | string | The query to search for. |

### !seek | /player seek `<time>`

??? info "DJs only if not alone."

    This command can only be used by DJs if there are more than 2 people in the voice channel.

Sets the playing time of the track to a new position.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<time>` | number or Notation | The time of the track to seek to in colon notation or in milliseconds. |

### !shuffle | /queue shuffle

??? info "DJs only if not alone."

    This command can only be used by DJs if there are more than 2 people in the voice channel.

Randomizes the entries in the queue.

### !skip | !s | /skip track

Skips the currently playing song, or vote to skip the track if the voice channel has more than 3 people. The track will skip if the required number of votes has been reached.

### !skipto | !jump | /skip jump `<queue_entry>`

??? info "DJs only if not alone."

    This command can only be used by DJs if there are more than 2 people in the voice channel.

Skips to the specified entry in the queue.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<queue_entry>` | number | The number of the queue entry to skip to. Skips all other entries of the queue. |

### !startover | !restart | /player startover

??? info "DJs only if not alone."

    This command can only be used by DJs if there are more than 2 people in the voice channel.

Restarts the currently playing song.

### !stop | /player stop

??? info "DJs only if not alone."

    This command can only be used by DJs if there are more than 2 people in the voice channel.

Destroys the player.

### !summon | !join | /player join

Summons the bot to a voice channel.

### !volume | !vol | /player volume view/set `[number]`

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

### !playlist-add | !pladd | /playlist add `<"name">` `[track]`

!!! info

    To add tracks, you must be the user that created the playlist, unless you have the **Administrator** permission.

Adds a track to a playlist.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<name>` | string | The name of the playlist to add tracks to. |
| `[track]` | URL | A track to add to the playlist. If nothing was provided and a player is currently playing a track, adds the currently playing track to the playlist. |

### !playlist-clone | !plclone | /playlist clone `<"name">` `["clone_name"]`

Creates a playlist by cloning an existing one.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<name>` | string | The name of the playlist to clone |
| `[clone_name]` | string | The name to give to the cloned playlist. If nothing was provided, affixes "- Copy" to the original name. |

### !playlist-delete | !pldelete | /playlist delete `<name>`

!!! info

    To delete a playlist, you must be the user that created the playlist, unless you have the **Administrator** permission.

Deletes a playlist.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<name>` | string | The name of the playlist to delete.

### !playlist-new | !plnew | /playlist new `<name>`

Creates a new playlist.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<name>` | string | The name to give to the new playlist. |

### !playlist-purge | !plpurge | /playlist purge

??? failure "Administrators only."

    This command is only available to server admimistrators.

Deletes all playlists on the server.

### !playlist-remove | !plremove | /playlist remove `<"name">` `<index_or_start>` `[end]`

!!! info

    To remove tracks, you must be the user that created the playlist, unless you have the **Administrator** permission.

Removes a track or multiple tracks from a playlist.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<name>` | string | The name of the playlist to remove tracks. |
| `<index_or_start>` | number | The track or the starting position to remove multiple tracks from the playlist. |
| `[end]` | number | The ending position to remove multiple tracks. |

### !playlist-show | !plshow | /playlist show

Lists all playlists on the server.

### !playlist-view | !plview | /playlist view `<name>`

List all tracks in a playlist.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<name>` | string | The name of the playlist to view.

## Settings
Commands to change the bot's settings. All commands in this category require the **Manage Server** permission unless otherwise specified.

### !allowexplicit | /settings allowexplicit `<toggle>`

Toggles the ability to allow age restricted content in the queue.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<toggle>` | string or boolean | Toggles the setting. Either `on` or `off`. Default is `on`. |

!!! warning

    This setting only applies to tracks that are marked as explicit. All pornographic websites are blocked regardless if this setting is on or not.

!!! info "Regarding tracks from YouTube."

    If a cookie wasn't provided in `cookies.json`, you'll still be able to use this command. The player won't be able to play any track that's marked explicit without a valid cookie that allows access to age restricted content.

### !allowfilters | /settings allowfilters `<toggle>`

Toggles the ability to allow members to apply filters to the player.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<toggle>` | string or boolean | Toggles the setting. Either `on` or `off`. Default is `on`. |

### !allowlinks | /settings allowlinks `<toggle>`

Toggles the ability to add songs to the queue from a URL.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<toggle>` | string or boolean | Toggles the setting. Either `on` or `off`. Default is `on`. |

### !allowsilenttracks | /settings allowsilenttracks `<toggle>`

Toggles the ability to silently add tracks to the queue.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<toggle>` | string or boolean | Toggles the setting. Either `on` or `off`. Default is `on`. |

### !blocksong add/remove | /settings blocksong add/remove `<phrase>`

Manages the server's list of blocked search phrases.

| Subcommand | Description |
| ---------- | ----------- |
| add | Adds a phrase to the list. |
| remove | Removes a phrase from the list. |

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<phrase>` | string | The phrase to add or remove from the list. |

### !defaultvolume | /settings defaultvolume `<volume>`

Changes the bot's default volume when creating a player, or when disabling Earrape.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<volume>` | number | The new default volume for the server. Must be between `1` to `200`. Default is `100`. |

### !djmode | /settings djmode `<toggle>`

!!! info
    
    DJs can use this command.

Toggles DJ Mode for the server.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<toggle>` | string or boolean | Toggles the setting. Either `on` or `off`. Default is `off`. |

### !emptycooldown | /settings global emptycooldown `<time>`

??? failure "Bot owner only."

    This is a global setting that can only be changed by the owner of the application.

Sets how long the bots stays in an empty voice channel.

`<time>` The time the bot will stay in seconds.

!!! info

    This settings only works if **Leave on Empty** is on.

### !freevolume | /settings unlimitedvolume `<toggle>`

Toggles the ability to change the volume past 200%.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<toggle>` | string or boolean | Toggles the setting. Either `on` or `off`. Default is `on`. |

### !globalsettings | /settings global current

??? failure "Bot owner only."

    This command is restricted to the owner of the application.

Shows the bot's current global settings.

### !leaveonempty | /settings global leaveonempty `<toggle>`

??? failure "Bot owner only."

    This is a global setting that can only be changed by the owner of the application.

Toggles whether the bot should leave when the voice channel is empty for a period of time.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<toggle>` | string or boolean | Toggles the setting. Either `on` or `off`. Default is `on`. |

!!! info

    When this is active, the bot will leave depending on how long **Empty Cooldown** is set.

### !leaveonfinish | /settings global leaveonfinish `<toggle>`

??? failure "Bot owner only."

    This is a global setting that can only be changed by the owner of the application.

Toggles whether the bot should leave when the end of the queue has been reached.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<toggle>` | string or boolean | Toggles the setting. Either `on` or `off`. Default is `on`. |

### !leaveonstop | /settings global leaveonstop `<toggle>`

??? failure "Bot owner only."

    This is a global setting that can only be changed by the owner of the application.

Toggles whether the bot should leave when the player is stopped.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<toggle>` | string or boolean | Toggles the setting. Either `on` or `off`. Default is `on`. |

### !maxtime | /settings maxtime `<duration>`

Restrict members from adding tracks to the queue that exceed the duration set.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<duration>` | Notation | The max duration of the track to limit. Members will be unable to add any tracks to the queue that go past this limit. Default is `0`. Set to `0` or `none` to disable. |

### !prefix | /settings prefix `[new_prefix]`

Changes the bot's prefix for this server.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `[new_prefix]` | string | The new prefix you want to use. If none was provided, resets the prefix to defaults. |

!!! info

    This setting will only affect message based commands, not slash commands. The default prefix defined in the bot's configuration in addition to the bot's mention will always be available.

### !resetdata

??? info "Prefix command only."

    This command is only available as a prefix command.


??? failure "Administrators only."

    This command is only available to server admimistrators.

Resets the bot's settings for the server to its default settings.

### /settings remove `<setting>`

??? info "Slash command only."

    This command is only available as a slash command.

Revert a setting to its default value.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<setting>` | string | The setting you would like to revert. |

### !setdj | /setting djrole `[role]`

Sets the DJ role for the server.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `[role]` | Role | The role you would like to set. Can be the name, the ID, or a mention of the role. If none was provided, removes the DJ role. |

### !setqueuelimits | /settings setqueuelimts `<number>`

Limits the number of entries that members can add to the queue.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<number>` | number | The numbers of entries to limit for members. |

### !settings | /settings current

Displays the bot's current settings for the server.

### !shownewsongonly | /settings global shownewsongonly `<toggle>`

??? failure "Bot owner only."

    This is a global setting that can only be changed by the owner of the application.

Toggles whether the Now Playing alerts are shown for new songs only.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<toggle>` | string or boolean | Toggles the setting. Either `on` or `off`. Default is `on`. |

### !streamtype | /settings global streamtype `<encoder>`

??? failure "Bot owner only."

    This is a global setting that can only be changed by the owner of the application.

Selects which audio encoder the bot should use during streams.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<encoder>` | string | The audio encoder to use.|

| Encoder | Description |
| ------- | ----------- |
| opus | Uses the Opus encoder. Better quality, uses more resources. |
| raw | Uses a RAW encoder. Better performance, uses less resources. |

### !textchannel | /settings textchannel `[channel]`

Sets the text channel to use for music commands.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `[channel]` | Text/Voice Channel | The text or voice channel to apply. Can be the channel's mention or the channel's ID. If none is provided, all channels will be available. |

### !thumbnailsize | /settings thumbnailsize `<size>`

Changes the track's thumbnail size of the player's "Now Playing" embeds.

| Arguments | Type | Description |
| --------- | ---- | ----------- |
| `<size>` | string | The size of the track's image. Either `small` or `large`. Default is `small`. |