# Changelog

## 2025.2.0
This release mainly includes some quality of life changes. A big one was implementing support for Discord's new DAVE (Discord Audio & Video End-to-end Encryption) protocol.

!!! danger "Breaking Changes"

    Node.js 22.12.0 or later is now required to run the bot.

!!! warning "Important"

    In the near future, if you plan to play tracks from YouTube using yt-dlp, [Deno](https://deno.com/) will need to be installed on your system. [Learn more](https://github.com/yt-dlp/yt-dlp/issues/14404)

* **Added:** New commands
    - `/settings global import`
    - `/settings global export`
    - `/settings emitsongadd`
    - `[p]emitsongadd`
* **Added** New subcommands to `/search`.
    - `/search soundcloud`
    - `/search youtube`
* **Added:** An option to toggle Song Added alerts.
* **Added:** Support for the DAVE (Discord Audio & Video End-to-end Encryption) protocol.
* **Added:** Support for Node.js 24
* **Added:** New environment variables
    - `USE_YOUTUBE_PLUGIN`
* **Added:** Search providers to `[p]search`. Only `soundcloud` or `youtube` are available. Defaults to `soundcloud` if no valid provider is used.
* **Added:** New packages.
    - @snazzah/davey
    - spotify-uri
    - spotify-web-api-node
* **Added:** Additional logs when shutting down the bot.
* **Added:** Support to provide cookies to yt-dlp.
* **Changed:** `UPDATE_YTDLP` now defaults to `false`. This is useful if you frequently use nightly builds of yt-dlp.
* **Changed:** Position field in Song Added alerts no longer shows if there is only 1 track in the queue.
* **Changed:** Extended duration of the bot's typing indicator.
* **Changed:** Voting percentage is now "Vote Ratio". `[p]votepercentage` is still available as an alias to `[p]voteratio`.
* **Changed:** Exceptions are no longer sent in embeds.
* **Fixed:** Track VC Status not setting properly if Repeat Mode is set to Loop Track.
* **Fixed:** `[p]playnow` not skipping a track. This also caused the player to break.
* **Updated:** Permission bits to recognize new permissions.
* **Updated:** Improved `pornPattern` regex.
* **Updated:** @discordjs/voice to 0.19.0
* **Updated:** @distube/yt-dlp to use my fork.
* **Updated:** @distube/ytdl-core to 4.16.22
* **Updated:** axios to 1.8.4
* **Updated:** better-sqlite3 to 12.2.0
* **Updated:** discord.js to 14.22.1
* **Updated:** enmap to 5.9.10
* **Updated:** slash-create to 6.6.3
* **Updated:** sodium-native to 5.0.3
* **Updated:** undici to 6.21.3
* **Updated:** tar-fs to 2.1.3
* **Removed:** Several instances of the old catchphrase "The Chad Music Bot".
* **Removed:** Removed packages.
    - libsodium-wrappers

[**Full Changelog**](https://github.com/200percentmicky/chadmusic/compare/2025.1.3...2025.2.0)

## 2025.1.3
This is a maintenance release.

!!! danger "Breaking Changes"

    Node.js 18 is no longer supported in this release. The bot will require Node.js 20 or later to run.

* **Changed:** The bot will now properly set a voice channel status whenever the bot moves to a new voice channel.
* **Changed:** Arguments for `[p]bindchannel` and `/player bindchannel` are now optional.
    - Providing no arguments will default to the channel where the command was used.
    - This was documented as being "optional", but the arguments were required. This was an oversight, and the functions are now implemented.
* **Fixed:** A potential regression from occuring in `[p]stop`.
* **Updated:** discord.js to 4.18.0
* **Updated:** @distube/ytdl-core to 4.16.3

[**Full Changelog**](https://github.com/200percentmicky/chadmusic/compare/2025.1.2...2025.1.3)

## 2025.1.2
This is a maintenance release.

* **Changed:** YTDL player clients to `WEB_EMBEDDED`.
* **Updated:** @discordjs/opus to 0.10.0
* **Updated:** @distubejs/ytdl-core to 4.15.9
* **Updated:** undici to 6.21.1

[**Full Changelog**](https://github.com/200percentmicky/chadmusic/compare/2025.1.1...2025.1.2)

## 2025.1.1
This is a maintenance release.

* **Fixed:** An oversight in `/settings global allowyoutube` where the wrong setting was being changed.
* **Updated:** discord.js to 14.17.3

[**Full Changelog**](https://github.com/200percentmicky/chadmusic/compare/2025.1.0...2025.1.1)

## 2025.1.0
Happy new year! Hope everyone had a great holiday season. This release makes some quality-of-life changes. Notable changes includes embed support for the "Add to queue" context menu, allowing the bot owner to toggle YouTube support, and a new environment variable to provide a custom FFmpeg binary, if desired.

!!! note "Notice"

    Make sure you use the `DELETE_INVALID_COMMANDS` variable in this release, as the letter case for the "Add to queue" context menu was changed from "Add To Queue" to "Add to queue". Not using this variable during startup will leave behind duplicate commands.

* **Added:** The ability for the bot owner to toggle YouTube support. The default toggle is `false`.
* **Added:** New commands:
    - `[p]allowyoutube` and `/settings global allowyoutube`
* **Added:** New environment variables:
    - `FFMPEG_PATH`
* **Added:** `clientAkairoDebug` event. Requires `DEBUG_LOGGING` to work.
* **Changed:** Updated emojis for the player's volume.
* **Changed:** `[p]eval` to be more compatible with codeblocks.
* **Changed:** `Add to queue` to support rich embeds, including embeds from links.
    - The bot will use the following in order to parse content: `url` -> `title` -> `description`
        - If the bot wasn't able to find anything in the embeds, it'll use the message's content before failing.
* **Changed:** Voice channel status changes will now provide a reason in the audit log.
    - It's known that a reason will not be provided when the status is removed. This is most likely a limitation in the API.
* **Changed:** Reverted the player windows to use the `title` field for track names.
* **Changed:** `[p]eval` now provides a timestamp in the filename when the bot uploads a txt file.
* **Fixed:** A potential `TypeError` exception in `[p]maxtime`.
* **Fixed:** `/player lyrics` not being usable without an active player.
* **Fixed:** An exception occuring when soundcloud track thumbnails returning `undefined`.
* **Fixed:** An exception occuring in `/player lyrics` regarding a `GuildIdResolvable` being expected.
* **Updated:** @distube/ytdl-core to 4.15.8
* **Updated:** discord-akairo to 10.2.4 (Using [fork](https://github.com/200percentmicky/discord-akairo) of [@tanzanite/discord-akairo](https://github.com/TanzaniteBot/discord-akairo))
* **Updated:** discord.js to 14.17.2
* **Updated:** systeminformation to 5.23.23 (This fixes a security vulnerability.)

[**Full Changelog**](https://github.com/200percentmicky/chadmusic/compare/2024.5.0...2025.1.0)

## 2024.5.0
This release that adds support for proxy connections, fixes custom playlist support, and updated internal functions to make it more convenient to the bot owner.

* **Added:** Proxy support.
* **Added:** New environment variables.
    - `PROXY`
* **Changed:** Updated the appearance of `/core debug`.
* **Changed:** Adding tracks into custom playlists now uses yt-dlp to resolve tracks.
* **Changed:** Default search provider to SoundCloud in `[p]play`, `[p]playnow`, `[p]search`, `/play track`, `/play now` and `/search`
* **Changed:** Simplified error messages of unhandled exceptions.
    - The full stack trace is no longer shown when an unhandled error occurs. They will still be visible to the application owner.
    - Buttons linking to the support server and GitHub repo are no logner provided in the message.
* **Changed:** `BUG_CHANNEL` now defaults to the owner's DMs if the variable is not set, or no valid channel ID is provided.
    - Setting `BUG_CHANNEL` to `false` will disable system messages.
* **Fixed:** Not being able to add tracks to a custom playlist due to a breaking change in DisTube v5.
* **Fixed:** Cookies not being applied to the correct plugin.
* **Updated:** discord.js to 14.16.3
* **Updated:** @discordjs/voice to 0.18.0
* **Updated:** @distube/soundcloud to 2.0.4
* **Updated:** @distube/youtube to 1.0.4
* **Updated:** @distube/ytdl-core to 4.15.1
* **Updated:** @distube/ytsr to 2.0.4

[**Full Changelog**](https://github.com/200percentmicky/chadmusic/compare/2024.4.1...2024.5.0)

## 2024.4.1
This is a maintenance release.

!!! info "Update 10/10/2024"

    A while ago, I previously stated that ChadMusic was going to be rewritten and rebranded. For now, I've decided to vault the rewrite for the time being and resume active development on this repository. I may return to rewriting the bot in the future, but it will be done on this repository in a seperate branch. I probably won't rebrand the project or anything of that nature since it's not really necessary to do so.
    
    In regards to the `Sign in to confirm you're not a bot` and `Status code: 403` errors, I'm well aware that this is an ongoing issue. As of right now, providing your cookies in the `cookies.json` file will no longer work if this error occurs. I will be implementing a fix for it in the future, but right now it's currently not my top priority to implement a fix for it at this time. If you have a valid IPv6 range address, try utilizing IP rotation for now.

* **Changed:** [Internal] hasExt function will now check if a file exists in Discord's CDN.
* **Changed:** [Internal] Merged all createAgent functions into one function.
* **Fixed:** Masked links for the Uploader field PlayerWindow showing `undefined`.
* **Fixed:** Build errors occuring when attempting to run the build script or from running `npm install`. ([#21](https://github.com/200percentmicky/chadmusic/issues/21))

[**Full Changelog**](https://github.com/200percentmicky/chadmusic/compare/2024.4.0...2024.4.1)

## 2024.4.0
This release updates the bot to DisTube v5 and incorporates new featues and changes introduced in the new version.

* **Added:** New environment variables.
    - SOUNDCLOUD_CLIENT_ID
    - SOUNDCLOUD_OAUTH_TOKEN
    - SPOTIFY_CLIENT_ID
    - SPOTIFY_CLIENT_SECRET
    - SPOTIFY_TOP_TRACKS_COUNTRY
    - FFMPEG_DEBUG_LOGGING
* **Added:** `playerDebug` event.
* **Added:** Missing **Track Title as VC Status** field to `[p]settings` and `/settings current`.
* **Added:** New a subcommand to `[p]blocksong` and `/settings blocksong`.
    - `[p]blocksong`
    - `/settings blocksong list`
* **Added:** A newly added track's position in the queue to player windows.
* **Changed:** SoundCloud is now the default source when using `[p]play` and `/play track`.
* **Changed:** App owner information is now fetched during boot.
* **Changed:** The list of blocked songs no longer show in settings in favor of the new subcommands above.
* **Changed:** The search menu in `[p]search` and `/search` to properly defer after selecting a track.
* **Changed:** Player errors now show the track that errored out. The errors also no longer show the error name, only its message.
* **Changed:** Replaced functions for IP Rotation to not use a proxy.
* **Changed:** Simplified the message for setting a DJ role with a role that's already recognized as a DJ.
* **Changed:** Reverted eval to being synchronous due to an issue of not being able to define variables.
* **Changed:** The `clientReady` event to run once.
* **Changed:** `ffmpegDebug` now requires both DEBUG_LOGGING and FFMPEG_DEBUG_LOGGING to log.
* **Fixed:** An issue causing a `TypeError` exception in `[p]play` when providing no content in between the `<>` characters. (These characters are used to prevent generating embeds for links.)
* **Fixed:** Current player volume not being shown (causing an exception) when running `[p]volume` without arguments and `/player volume view`.
* **Fixed:** An issue in `[p]allowexplicit` that causes the usage prompt to always show regardless if arguments are provided.
* **Updated:** DisTube to 5.0.2
* **Updated:** @distube/ytdl-core to 4.14.3
* **Updated:** undici to 6.19.2
* **Removed:** The following environment variables.
    - OWNER_ID (The app owner's user ID is automatically fetched after boot.)
    - SPOTIFY_EMIT_EVENTS_AFTER_FETCHING
    - SPOTIFY_PARALLEL

[**Full Changelog**](https://github.com/200percentmicky/chadmusic/compare/2024.3.3...2024.4.0)

## 2024.3.3

!!! bug

    There is an issue that prevents some tracks from loading. This has been fixed, and can be patched by running `npm run update` from the terminal. ytdl-core will now be updated to 4.13.6 instead.

This release fixes a major bug and patches security vulnerabilities.

* **Updated:** @distube/ytdl-core to 4.13.5 ([#20](https://github.com/200percentmicky/chadmusic/issues/20))
* **Updated:** undici to 6.19.2
* **Updated:** ws to 8.18.0

[**Full Changelog**](https://github.com/200percentmicky/chadmusic/compare/2024.3.2...2024.3.3)

## 2024.3.2
This is a maintenance release.

* **Changed:** The message when enabling Leave on Empty to include the currently set Empty Cooldown time.
* **Fixed:** Permission issues for the following commands that were falsely marked as "Owner Only". These commands are available to everyone and require the **Manage Server** permission to use.
    - `[p]emptycooldown`
    - `[p]leaveonempty`
    - `[p]leaveonfinish`
    - `[p]leaveonstop`
    - `[p]songvcstatus`

[**Full Changelog**](https://github.com/200percentmicky/chadmusic/compare/2024.3.1...2024.3.2)

## 2024.3.1
This is a maintenance release.

* **Fixed:** Leave on empty activating when a voice channel is not empty.
* **Updated:** Discord.js to 14.15.3
* **Updated:** slash-create to 6.1.4

[**Full Changelog**](https://github.com/200percentmicky/chadmusic/compare/2024.3.0...2024.3.1)

## 2024.3.0
This release adds sudo access which grants the bot owner DJ for a server regardless of permissions, changes sharding to use [discord-hybrid-sharding](https://www.npmjs.com/package/discord-hybrid-sharding), and fixes additional bugs that have been present in the bot for quite some time. This release also adds a few new features that may be useful for debugging purposes.

* **Added:** Sudo access. ([#17](https://github.com/200percentmicky/chadmusic/issues/17))
* **Added:** New commands.
    - `[p]sudo` | `/core owner sudo`
* **Added:** `creatorError` event.
* **Added:** `processExit` event. This is useful if the bot's Node.js process exited with a non-zero status code.
* **Added:** `SHARDS_PER_CLUSTER` variable.
* **Added:** `ffmpegDebug` event. Set `DEBUG_LOGGING` to `true` to enable.
* **Added:** User's global nicknames to the footers of player windows.
* **Added:** Autocomplete to `/search`.
* **Added:** `exitCode` parameter to `ChadMusic.die()`. Default is `0`.
* **Added:** Sharding info to `/core debug`.
* **Changed:** Blocked live streams and radio broadcasts from being added to the queue while a max time limit is set.
* **Changed:** Sharding to use [discord-hybrid-sharding](https://www.npmjs.com/package/discord-hybrid-sharding). ([#15](https://github.com/200percentmicky/chadmusic/issues/15))
* **Changed:** Eval is now asynchronous.
* **Changed:** DJ check variables throughout the bot to use `isDJ` function.
* **Changed:** `unhandledException` event to use `ChadMusic.die()` with a exit code of `1`.
* **Fixed:** Playlists bypassing max queue limits, if any.
* **Fixed:** `[p]shutdown` not working without the `BUG_CHANNEL` variable being defined, causing a `TypeError` exception. 
* **Fixed:** Max time limits not destroying the player if the queue is empty causing a `TypeError` exception in some commands. ([#19](https://github.com/200percentmicky/chadmusic/issues/19))
* **Fixed:** An error occurring in `/core debug` due to a package with an undefined export.
* **Updated:** DisTube to 4.2.2
* **Updated:** Discord.JS to 14.15.2
* **Updated:** slash-create to 6.1.3
* **Removed:** Commit hash string from version number.
* **Known issue:** There is a slight delay by around ~1 second when changing filters. There is currently no fix for this at the moment.
* **Known issue:** It's possible for members without DJ permissions to add a playlist with tracks that exceed max time limits. Currently looking into this issue.

[**Full Changelog**](https://github.com/200percentmicky/chadmusic/compare/2024.2.1...2024.3.0)

## 2024.2.1
This is a maintenance release.

* **Changed:** Inhibitors are no longer reloaded when using `[p]reload` and `/core owner reload`.
* **Fixed:** `[p]reload` and `/core owner reload` throwing a `TypeError` for a function that was renamed.

[**Full Changelog**](https://github.com/200percentmicky/chadmusic/compare/2024.2.0...2024.2.1)

## 2024.2.0
This release adds a few new features such as changing the voting system when skipping a track to have a per-server custom percentage, a way for the bot to set the playing track's title as a voice channel status, and ways to easily change the bot's avatar and (more recently) its profile banner.

!!! warning "This release contains an experimental feature."

    Voice channel statuses are considered experimental as they're not documented in Discord's API and may change or break at any time. [Learn more.](https://github.com/discord/discord-api-docs/pull/6400)

* **Added:** New commands.
    - `[p]songvcstatus` | `/settings songvcstatus`
    - `[p]votepercentage` | `/settings votepercentage`
    - `[p]setavatar` | `/core owner setavatar`
    - `[p]setbanner` | `/core owner setbanner`
    - `/settings setgame`
* **Added:** `custom` and `competing` as valid playing status types to `[p]setgame` and `/core owner setgame`
* **Added:** [Experimental] The ability for the bot to add the playing track's title as a voice channel status.
* **Added:** [Internal] `die()` to client. Used for destroying the client when shutting down.
* **Added:** [Internal] `CMPlayerWindow` class.
* **Changed:** Default playing status type to `custom` in `[p]setgame` and `/core owner setgame`.
* **Changed:** More emojis from raw unicode to strings.
* **Changed:** Changed command descriptions for various commands.
* **Changed:** Various UI changes.
    - Moved the currently playing track's title to the `description` field in the Now playing embeds.
    - Changed some prompts regarding blocked features during livestreams from `error` to `no`.
* **Changed:** [Internal] Moved register slash command functions to the `ready` event.
* **Fixed:** A typo that displayed `undefined` when a player error occured.
* **Fixed:** An issue where votes for skipping are not being removed when the track finishes itself, if votes are present.
* **Fixed:** A regression that prevented a stack trace from being logged to a text channel when a slash command errored.
* **Fixed:** A regression in `/play attachment` that prevented attachments from being added to the queue.
* **Fixed:** Security vulnerabilities regarding some old packages.
* **Fixed:** A memory-leak that occured in an older version of undici.
* **Updated:** Discord.js to 14.14.1
* **Updated:** Fork of discord-akairo to 10.1.2-dev
* **Updated:** slash-create to 6.0.2
* **Updated:** undici to 6.6.0
* **Removed:** Unnecessary **Embed Links** client permissions from many commands that don't need it.
* **Removed:** Global setting values from `[p]globalsettings` and `/settings global current`.
* **Removed:** [Internal] Unused functions and variables.

[**Full Changelog**](https://github.com/200percentmicky/chadmusic/compare/2024.1.0...2024.2.0)

## 2024.1.0
First and foremost, Happy New Year to everyone! I hope everyone had a great holiday season. To welcome 2024, this release marks the beginning of the 2024 builds of ChadMusic.

This release contains a lot of internal changes including overhauling the bot's console log. This release also fixes some lingering issues as well as adding and changing additional features.

!!! warning "Changes to slash commands."

    This release contains changes to slash commands. It's recommended to change DELETE_INVALID_COMMANDS to `true` in the environment variables before starting the bot.

* **Added:** [Internal] Added CMError class.
* **Added:** [Internal] Added partials and intents for Direct Messages.
* **Added:** [Internal] Error handling when starting the bot. If the bot crashes on startup, it's now logged as `FATAL`.
* **Added:** New commands.
    * `[p]pulsator` is now a prefix command.
    * `[p]move` | `/queue move`
* **Added:** List of available slash commands to `[p]help`.
* **Added:** A comformation prompt to `[p]setdj` and `/settings djrole` when adding a role that already has DJ permissions.
* **Added:** [Internal] Two new scripts to `package.json`. Run these scripts by using `npm run`.
    * `update` updates the bot to the `main` (stable) branch.
    * `update:dev` updates the bot to the `develop` branch.
* **Added:** [Internal] New packages.
* **Added:** Voice Channel field to Now Playing embeds.
* **Changed:** [Internal] Updated permission bits.
* **Changed:** `[p]iheartradio` and `/play radio iheartradio` will now provide search results instead of playing the first station.
* **Changed:** `emptycooldown`, `leaveonempty`, `leaveonfinish`, and `leaveonstop` are now configurable per-server. Because of this, the following commands were changed:
    * `[p]emptycooldown`, `[p]eaveonempty`, `[p]leaveonfinish`, and `[p]leaveonstop` now requires the **Manage Server** permission to use.
    * [Breaking] Changed slash command names.
        * `/settings global emptycooldown` -> `/settings emptycooldown`
        * `/settings global leaveonempty` -> `/settings leaveonempty`
        * `/settings global leaveonfinish` -> `/settings leaveonfinish`
        * `/settings global leaveonstop` -> `/settings leaveonstop`
* **Changed:** [Interal] Overhauled logging to use `tslog`.
* **Changed:** Prevent slash commands from executing in Direct Messages. (except for `/core`)
* **Changed:** `[p]license` will default to sending a direct message to the user.
    * If direct messages are not being accepted, it will send it to the channel instead.
* **Changed:** Prevented the following commands from being used during live broadcasts.
    * `[p]seek`
    * `[p]reverse`
    * `[p]tempo`
    * `/player seek`
    * `/filter reverse`
    * `/filter tempo`  
* **Changed:** Prompts in `[p]startover` and `/player startover` to acknowledge live streams.
* **Fixed:** `[p]nowplaying` and `/player nowplaying` throwing an exception whenever a track's duration isn't provided.
* **Fixed:** The bot not responding in Direct Messages.
* **Fixed:** `[p]search` throwing a `Invalid string length` exception.
    * This was suppose to be fixed in 2023.4.3, but failed since it still provided a string that broke the menu.
    * After testing, this is now fully resolved.
* **Fixed:** IPv6 Rotation not being properly applied. It's now being applied every time a track is added to the queue.
* **Fixed:** `[p]help` showing the command's name in a list of aliases for a command.
* **Fixed:** `/settings djmode` not allowing DJs without the **Manage Server** permission to use the command.
* **Fixed:** Missing permissions message returning an empty string.
* **Fixed:** Reactions throwing an exception if the bot was missing the **Add Reactions** permission.
* **Removed:** Unused packages, including `underscore`.

[**Full Changelog**](https://github.com/200percentmicky/chadmusic/compare/2023.5.2...2024.1.0)

## 2023.5.2
This is a maintenance release.

This release mainly reinstates the support for classic prefix commands and removes the deprecation warning regarding it.

* **Added:** Link to documentation in `[p]about`, `[p]license`, `/core about`, and `/core license`.
* **Removed:** Deprecation message regarding classic prefix commands.

[**Full Changelog**](https://github.com/200percentmicky/chadmusic/compare/2023.5.1...2023.5.2)

## 2023.5.1
This is a maintenance release.

**Fixed:** Fixed an issue in `[p]playlist-add` where the track's URL wasn't being provided correctly.

[**Full Changelog**](https://github.com/200percentmicky/chadmusic/compare/2023.5.0...2023.5.1)

## 2023.5.0
This release adds support for playlists, sharding support, changes how cookies are managed, and improves IPv6 rotation support.

!!! danger "Breaking Changes"

    * Node.js 18 is now required since Node.js 16 has reached end-of-life.
    * The reactions in `[p]iheartradio`, `[p]play`, and `[p]search` had their variables switched from `EMOJI_MUSIC` to `REACTION_MUSIC`.
    
!!! warning "Deprecated Features"

    * The `YOUTUBE_COOKIES` environment variable has been deprecated in favor of the new cookies system. You may still use this variable, but its use may be removed in a future release.
    * Classic prefix commands have been deprecated (despite fixing current commands and creating new ones for this release) to focus on improvements to slash commands. They will not be removed anytime soon and the `PREFIX` variable can still be applied if you wish to use them, but no more commands will be made after this release.

* **Added:** Support for creating and managing playlists.
* **Added:** New commands.
    * `[p]playlist-add` | `/playlist add`
    * `[p]playlist-clone` | `/playlist clone`
    * `[p]playlist-delete` | `/playlist delete`
    * `[p]playlist-new` | `/playlist new`
    * `[p]playlist-purge` | `/playlist purge`
    * `[p]playlist-remove` | `/playlist remove`
    * `[p]playlist-show` | `/playlist show`
    * `[p]playlist-view` | `/playlist view`
    * `/play playlist`
* **Added:** Support to shard the bot.
* **Added:** New environment variables.
    * `SHARDING`
    * `SHARDS`
    * `SPOTIFY_EMIT_EVENTS_AFTER_FETCHING`
    * `SPOTIFY_PARALLELL`
* **Added:** New file: `cookies.json`
* **Added:** The build number to the version string.
* **Changed:** `[p]iheartradio` and `/play radio iheartradio` now provides search results for stations, instead of playing the first result.
* **Changed:** Implemented a new cookies system.
* **Changed:** Implemented improved IPv6 Rotation support.
* **Changed:** Increased spacing in `[p]queue` and `/queue now`.
* **Changed:** `[p]search` and `/search` no longer throws an exception when no results were found.
* **Changed:** Options for fetching content from Spotify are now configurable.
* **Changed:** `allowFreeVolume` is now `false` by default.
* **Changed:** Minor changes to the logs.
* **Changed:** Miscellaneous code cleanup.
* **Changed:** Updated packages. The bot is now using Discord.js v14.13.0 and slash-create v5.13.0.
* **Fixed:** `/core debug` is now fully functional and no longer errors out.
* **Fixed:** `[p]reload` uses the proper emojis for reactions.
* **Removed:** Old unused JSON files.

[**Full Changelog**](https://github.com/200percentmicky/chadmusic/compare/2023.4.6...2023.5.0)

## 2023.4.6
This is a maintenance release.

* **Fixed:** Fixed `/skip force` from throwing `Unknown interaction` exception.
* **Fixed:** `[p]play` no longer logs autocomplete not being implemented.
* **Known issue:** Using `[p]search` may throw a `Invalid string length` exception. Use `/search` for the time being.

[**Full Changelog**](https://github.com/200percentmicky/chadmusic/compare/2023.4.5...2023.4.6)

## 2023.4.5
This is a maintenance release.

* **Changed:** `[p]reverse` and `/filter reverse` no longer uses an argument. Running the command now toggles the filter.
* **Changed:** `[p]thumbnailsize` no longer has any aliases.

[**Full Changelog**](https://github.com/200percentmicky/chadmusic/compare/2023.4.4...2023.4.5)

## 2023.4.4
This is a maintenance release.

ChadMusic now has **[documentation](https://200percentmicky.github.io/chadmusic)**! It will always be up to date with the latest version.

* **Added:** A button that points to the documenation in `[p]help`.
* **Changed:** Command syntax in `[p]help` to use a code-block.
* **Changed:** Argument in `/settings textchannel` is now optional. If nothing is provided, the setting will be removed.
* **Changed:** Shutting down the bot will properly provide a 0 exit code.
* **Fixed:** Select menu breaking in `[p]search` and `/search` due to name limits.
    * This was suppose to be fixed in 2023.4.3, but failed since it still provided a string that broke the menu.
* **Fixed:** The buttons in `[p]resetdata` not showing or working at all.
* **Removed:** Unused variables in `.env.example`.
* Updated dependencies.
* Updated README

[**Full Changelog**](https://github.com/200percentmicky/chadmusic/compare/2023.4.3...2023.4.4)

## 2023.4.3
This is a maintenance release.

* **Changed**: Search results now use a builder method.
* **Fixed**: Search results throwing an error if the Select Menu label exceeds 100 characters.
* **Removed**: Deprecated methods.

[**Full Changelog**](https://github.com/200percentmicky/chadmusic/compare/2023.4.2...2023.4.3)

## 2023.4.2
This is a maintenance release.

This update mainly removes the "#0" discriminator from accounts that updated to the new username system.

[**Full Changelog**](https://github.com/200percentmicky/chadmusic/compare/2023.4.1...2023.4.2)

## 2023.4.1
This is a maintenance release.

Added

* Added a new function to check for file extensions when uploading files, or using URLs with a file extension.
* Added missing information in `[p]play` regarding support for attachments.

Changes

* The message and slash command interactions were added to player events to be handled better.
* An error will now be thrown if a file that was uploaded was not a video or audio file, or the file couldn't be read.
* Internal code changes.

Removed

* Some unused dependencies were removed.
* Removed an unused function.

[**Full Changelog**](https://github.com/200percentmicky/chadmusic/compare/2023.4.0...2023.4.1)

## 2023.4.0-1
This is just a minor update that updates @distube/ytdl-core to 4.11.10.

!!! note

    This will probably be the one and only time I do this. In the future, when a dependency needs updated, just use `npm install` to update the package to the latest version. I will update the latest release to provide instructions when I'm aware of a dependency update.

[**Full Changelog**](https://github.com/200percentmicky/chadmusic/compare/2023.4.0...2023.4.0-1)

## 2023.4.0
This is a feature release.

Added

* New commands.
    * `[p]globalsettings` and `/settings global current`
    * `[p]leaveonempty` and `/settings global leaveonempty`
    * `[p]leaveonfinish` and `/settings global leaveonfinish`
    * `[p]leaveonstop` and `/settings global leaveonstop`
    * `[p]shownewsongonly` and `/settings global shownewsongonly`
    * `[p]streamtype` and `/settings global streamtype`
    * `[p]emptycooldown` and `/settings global emptycooldown`

Changed

* Message command arguments were overhauled to better support your bot's mention as a prefix.
* Embed colors are now parsed as hex values. Please consider updating your colors to use hex values in your `.env` file.
* Updated the `Usage` prompt to use a code block.
* All emojis have been updated to their string counterparts. This was due to an internal change in Discord that prevented emojis from rendering in the client.
* Other internal changes to class names, how the embeds are structured, and how the code is structured overall.
* In addition to the new commands above, boolean values are now accepted.
* Updated dependencies. The bot is now running on Discord.JS 14.11.0, and slash-create 5.12.0.

Fixes

* The bot will now stay in the voice channel if "Leave on Stop" is disabled.
* Fixed an issue in `[p]forceskip` and `/skip force` where the bot would send the "Skipping..." prompt regardless if the end of the queue was reached.
* Fixed an issue in `[p]skipto` where it wasn't jumping to the selected track.
* Fixed an issue in `[p]thumbnailsize` where any value was being accepted. The command should only accept either **large** or **small**.

Removed

* The following environment variables will no longer be used. They were replaced with the above commands that the owner can configure without restarting the bot. (excluding SERVER_INVITE.)
    * LEAVE_ON_STOP
    * LEAVE_ON_FINISH
    * LEAVE_ON_EMPTY
    * EMIT_NEW_SONG_ONLY
    * SERVER_INVITE
* The bot will no longer set its game status to "Watching your mom" when starting up. This was an inside joke from when the bot was closed source.

[**Full Changelog**](https://github.com/200percentmicky/chadmusic/compare/2023.3.3...2023.4.0)

## 2020.3.3
This is a maintenance release.

Fixes

* The bot will now stay in the voice channel if LEAVE_ON_STOP is not `true` or commented out in the `.env` file.
* Fixed an issue in `[p]forceskip` and `/skip force` where the bot would send the "Skipping..." prompt regardless if the end of the queue was reached.

[**Full Changelog**](https://github.com/200percentmicky/chadmusic/compare/2023.3.2...2023.3.3)

## 2023.3.2
This is a minor maintenance release.

Changes

* The license template was changed in all files.

Fixes

* Fixed an issue with the instance owner returning `undefined` in `[p]about` and `/core about`. This was also a bug that was suppose to be fixed in 2023.3.1, but the fix failed.

Removed

* Removed deprecation warning since I decided to resume maintaining message based commands for the bot.

[**Full Changelog**](https://github.com/200percentmicky/chadmusic/compare/2023.3.1...2023.3.2)

## 2023.3.1
This is a maintenance release.

!!! note

    [chadtube](https://github.com/200percentmicky/chadtube) (my fork of [DisTube](https://github.com/skick1234/DisTube)) is now installable using npm. This will make building the bot so much easier in the future, and eliminates the requirement to clone the repo into the bot's root directory. The build script has been updated to reflect this, so all you need to do is run `npm run build` or just `npm ci` for a new or clean installation. In addition to this change, the `chadtube` directory can now be safely deleted.

Changes

* Updated dependencies which also adds chadtube as a dependency.
* Updated `[p]about` and `/core about` to include info regarding silent commands.
* Added a missing timeout to the cancel button in `/queue now`.
* If the application is owned by a team, the team's name and icon will be shown in `[p]about` and `/core about`.

Fixes

* Fixed an issue where the instance owner was returning `undefined` in `/core about`.

**[Full Changelog](https://github.com/200percentmicky/chadmusic/compare/2023.3.0...2023.3.1)**

## 2023.3.0
This release adds support for IPv6 rotations, and adds a new "pulsator" filter.

Added

* Adds support for IPv6 rotations. 
    * If you have an IPv6 block range (/64 is recommended), you can define it under IPV6_BLOCK in your .env file. You can learn more about it [here](https://github.com/fent/node-ytdl-core/blob/master/README.md#how-does-using-an-ipv6-block-help) (and its corresponding PR [here](https://github.com/fent/node-ytdl-core/pull/713)) . This requires that you know how to set up IPv6 on your host machine. If you do not know how to, you can just use YOUTUBE_COOKIE instead.
* Added a new filter: `/filter pulsator`
* Added the build number to `[p]about`

Changes

* Logger now properly shows the `debug` label.
* Refactored internal functions into classes.

Fixes

* Fixed an issue regarding a regex that was used in `[p]play`, `[p]playnow`, and `/play` commands returning `undefined`.

**[Full Changelog](https://github.com/200percentmicky/chadmusic/compare/2023.2.1...2023.3.0)**

## 2023.2.1
This is a maintenance release.

Added:

* The build number (the latest commit hash) is now shown in the bot's version string.

Changes:

* Silent tracks will now stay hidden when using `[p]skipto` or `/skip jump`.
* Reverted a change to how unexpected errors are returned.


## 2023.2.0
This is the first release of ChadMusic where versions are tracked.

This release adds the ability to silently add tracks to the queue. Silent tracks are hidden in the queue, and will not show in Now Playing embeds, nor will it be mentioned in the currently binded text channel. If you don't wish to use it, you can disable it by running `/settings allowsilent toggle:False`.

Commands have moved in this release.
`/stop`, `/grab` => Now subcommands of `/player`
`/about`, `/license`, `/ping`, and `/owner` => Now subcommands of `/core`

Various other bugs have been fixed in this release as well, such as the search command throwing an exception when an empty string is provided, or that the usage embed doesn't parse the embed color correctly.

This release will mark message based commands as deprecated. It's recommended to use the bot's slash commands instead. Message based commands will still receive bug fixes if they occur, but no new features will be added going forward.

This is my first time publishing a release on this repository. There may be a chance I might forget about it in the future. In the case that I don't publish a new release, you can keep track of stable releases in the `release` branch. Anyway, that's all for now and thanks for your interest in using the bot! 👋 
