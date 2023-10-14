# Changelog

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