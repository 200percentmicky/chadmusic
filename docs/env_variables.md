# Configuration
The bot utilizes environment variables for its configuration. The bot comes bundled with a `.env.example` that you can fill out. Once you're finished editing the file, rename it to `.env` so the bot can read and save that configuration during boot. If for any reason the values were changed while the bot is online, a reboot is necessary for the changes to take effect.

Below are all the variables that are used in case you want to make your own `.env` file instead.

## TOKEN

!> This field is required.

Your bot's token.

## PREFIX
The default prefix for your bot to respond to. Does not apply to slash commands.

?> If no prefix is provided, then your bot's mention will be used as a prefix instead.

## OWNER_ID
Your user ID. This is the unique ID that is attached to your Discord account and can only be retrieved by using developer mode. You must provide this for the bot to recognize you as the owner.

## APP_ID

!> This field is required.

Your application's user ID. This is needed for slash commands to sync to Discord.

## PUBLIC_KEY

!> This field is required.

Your application's public key. This is needed for slash commands to sync to Discord. Your bot's public key and can be fetched from your app's developer page.

## YOUTUBE_COOKIE
The cookie to use from YouTube. This is optional but recommended to use. To learn how to get a cookie header, you can look at the example from [here](https://github.com/fent/node-ytdl-core/blob/997efdd5dd9063363f6ef668bb364e83970756e7/example/cookies.js#L6-L12). It tells you how to get the cookie header. Once you have what you need, paste the entire content in this variable.

## IPV6_BLOCK
A IPv6 range block address. This is mainly used for proxy connections. If you have a IPv6 range, you can use it in this field. This will alleviate the need for a cookie. If you do not know how to use this field, or you don't have an active IPv6 range added to your host, you can leave this field empty and provide a cookie above instead.

?> A `/64` range address is recommended, and is usually the most common address assigned by many hosting providers.

## USE_YOUTUBE_DL
Enables youtube-dl. Set to `true` to allow the bot to use any website supported by youtube-dl. Defaults to `true`.

## UPDATE_YOUTUBE_DL
Allows the bot to download the most recent build of youtube-dl on boot. Defaults to `true`. Do not use this variable if you utilize a custom build.

## GENIUS_TOKEN
The token to access Genius API for song lyrics. If this variable is unused, scraping will be used instead.

## DEV_GUILD
The guild's ID. Enabling this will turn the bot's commands into guild commands for the specified guild. Do not use this varibale to make the commands global.

## USE_EVAL
Enables the `eval` command. With great power comes great responsibility.

## USE_CONSOLE
Allows the bot to log to the console window.

## DEBUG_LOGGING
Enables debug logging. Useful for reporting bugs.

## DELETE_INVALID_COMMANDS
Deletes any slash commands that are no longer valid to the bot. Do not use this variable if you have multiple programs controlling one bot account.

# Customization
You can customize the bot's user interface to your liking, such as using custom colors and emojis to make your bot unique. For colors, you can use [this tool](https://www.tydac.ch/color/). If you're using custom emojis, provide the entire string output of the emoji. You can get the emoji's ID anywhere in Discord by doing `\:emoji:` in a text channel. However, if you're using custom reaction, you must provide only the emoji ID, or a raw emoji like this: 👍

These values can only be used if the bot has the premissions to **Embed Links** and **Use External Emojis**. If the bot is missing the **Embed Links** permission, the bot can still send a standard text message. If the bot is missing the **Use External Emojis** permission, then the default emojis will be used.

## Embed Colors
- COLOR_OK
- COLOR_WARN
- COLOR_INFO
- COLOR_ERROR
- COLOR_QUESTION
- COLOR_NO
- COLOR_MUSIC

## Emojis
- EMOJI_OK = ✅
- EMOJI_WARN = ⚠️
- EMOJI_ERROR = ❌
- EMOJI_INFO = ℹ️
- EMOJI_QUESTION = ❓
- EMOJI_NO = 🚫
- EMOJI_LOADING = ⌚
- EMOJI_CUTIE = 🎶
- EMOJI_MUSIC = 🎵

## Reactions
- REACTION_OK = ✅
- REACTION_WARN = ⚠️
- REACTION_ERROR = ❌
- REACTION_INFO = ℹ️
- REACTION_QUESTION = ❓
- REACTION_NO = 🚫
- REACTION_LOADING = ⌚
- REACTION_CUTIE = 🎶
- REACTION_MUSIC = 🎵

