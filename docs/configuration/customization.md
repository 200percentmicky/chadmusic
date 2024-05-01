# Customization
This page goes into detail the environment variables that ChadMusic uses to manage the user interface. You can customize the bot's user interface to your liking, such as using custom colors in the embeds, to custom emojis that the bot has access to. For colors, you can use [this tool](https://www.tydac.ch/color/). If you're using custom emojis, provide the entire string output of the emoji. You can get the emoji's ID anywhere in Discord by doing `\:emoji:` in a text channel. If you're using custom reaction, you must provide only the emoji ID, or a raw emoji like this: 👍

For your changes to take effect, the bot needs to have the **Embed Links** and **Use External Emojis** permissions. If the bot is missing either of the following permissions, a fallback interface can be used so the bot can still communicate back to the end user. For the case with **Embed Links**, the bot will respond back using a standard text message. For the case with **Use External Emojis**, the default emojis below will be used instead.

## Embed Colors
You can define the bot's colors to use for the embeds in these variables. You can use [this tool](https://www.tydac.ch/color/) to find a color that you want.

!!! warning

    A hex value must be used to represent your embed colors. Using an integer to represent a color is not supported. Either the bot might throw a `DiscordAPIError` exception whenever the bot attempts to send an embed, or the bot will send the embed using a different color than what was set.

- COLOR_OK = 77B255
- COLOR_WARN = FFCC4D
- COLOR_INFO = 0093FF
- COLOR_ERROR = FF0000
- COLOR_QUESTION = B769FF
- COLOR_NO = DD2E44
- COLOR_MUSIC = 0093FF

## Emojis
You can define the emojis that the bot will use in its messages here. Its generally recommended to use the emoji's string value (such as `:white_check_mark:` or `:warning:`) instead of its raw unicode icon. If you want to use external emojis, you can get the emoji's ID anywhere in Discord by doing `\:emoji:` in a text channel, and then pasting the output in any field.

- EMOJI_OK = `:white_check_mark;`
- EMOJI_WARN = `:warning:`
- EMOJI_ERROR = `:x:`
- EMOJI_INFO = `:information_source:`
- EMOJI_QUESTION = `:question_mark:`
- EMOJI_NO = `:no_entry_sign:`
- EMOJI_LOADING = `:watch:`
- EMOJI_CUTIE = `:notes:`
- EMOJI_MUSIC = `:musical_note:`

## Reactions
You can define the emojis that the bot will use for reacting to messages here. If you want to use external emojis, you must use the emoji's ID, not the full string out of the emoji. You can get the emoji's ID anywhere in Discord by doing `\\:emoji:` in a text channel, and then pasting only its ID in any field.

- REACTION_OK = ✅
- REACTION_WARN = ⚠️
- REACTION_ERROR = ❌
- REACTION_INFO = ℹ️
- REACTION_QUESTION = ❓
- REACTION_NO = 🚫
- REACTION_LOADING = ⌚
- REACTION_CUTIE = 🎶
- REACTION_MUSIC = 🎵

## Button Emojis
For use in buttons. These are provided in the buttons attached to the queue. If you wanna use your own emojis, you can provided them here. If you're using a custom emoji, only provide the ID of the emoji. To use custom emojis for the UI Emojis, provide the entire string output of the emoji. You can get the emoji's ID anywhere in Discord by doing `\:emoji:` in a text channel.

- FIRST_PAGE = ⏮
- PREVIOUS_PAGE = ⬅
- NEXT_PAGE = ➡
- LAST_PAGE = ⏭
- JUMP_PAGE = ↗
- CLOSE = ✖
