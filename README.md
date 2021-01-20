# ChadMusic - The Chad Music Bot
ChadMusic is music bot that supports over 700+ websites and has filter support. Based off of DisTube.js, the bot was originally inspired off of Tony, another music bot that supported a lot of sources, and allowed filters to be applied.

Things you can do with ChadMusic:
- Play sources from any site that YouTube-DL supports. YouTube, Soundcloud, Twitch, etc.
- Unlimited Volume! The sky is the limit!
- Apply filters to the player, with more being added in the future!

ChadMusic has its downsides however:
- You cannot play live radio.
- Spotify does not work. (Support will be added later.)
- You can only apply one filter at a time.

⚠ This bot is still a work in progress. There may be a hiccup here and there, and some features that are present in the bot's settings page are not fully implemented.

__Commands__

🎶 Player
- `play <URL|query>` - Plays a song by URL or search query.
- `search <query>` - Searches YouTube based off of your search query.
- `stop` - Stops the player and clears the queue.
- `skip` - Skips the currently playing song. Also casts a vote if more than 4 people are in a VC.
- `grab` - Sends the currently playing song to your DMs.
- `nowplaying` - Shows the currently playing song.
- `queue` - Shows the current queue.
- `filter <filter>` - Applies a filter to the player.
- `volume <value>` - Adjusts the volume of the player.
- `earrape` - Adjusts the volume to 42069%. If the volume is over 5000%, adjusts the volume to 100%.
- `summon` - Makes the bot join the current VC.
- `disconnect` - Makes the bot leave the current VC.
- `shuffle` - Shuffles the current queue.

⚙ Settings
- `djmode` - Toggles DJ Mode for the server. When DJ Mode is on, only DJs can use the bot.
- `setdj <role>` - Sets the DJ Role for this server.
- `setqueuelimit <number>` - Limits the number of entries that members can add to the queue.
- `freevolume` - Toggles Unlimited Volume. If Unlimited Volume is OFF, limits the player's volume to 200%.
- `maxtime <duration>` - Allows you to restrict songs from being added to the queue if the duration of the video exceeds this.
- `prefix <newprefix>` - Changes the bot's prefix for the server.
- `settings` - Views the server's current settings for the bot.

🛠 Utilities
- `about` - About ChadMusic
- `eval` - (Owner) Executes Javascript Code
- `help [command]` - Shows a list of commands for the bot. If a command is provided, shows more info about the command.
- `invite` - Provides the bot's invite link.
- `ping` - Measures connection latency to Discord.
- `restart` - Restarts the bot. Works if the bot is managed by a process manager.
- `stats` - Shows technical stats about the bot.

## Hosting Info

If you wish to self host ChadMusic, you may do so at your own risk. No support will be provided to you if you decide to go down this route.
License under the MIT License. Read LICENSE for more information.

**Don't feel like hosting? Invite my bot to your server!**
https://discord.com/oauth2/authorize?client_id=375450533114413056&permissions=1005972566&scope=applications.commands%20bot
