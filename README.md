<h1 align="center" style="font-weight: bold; font-style: italic;">
    <img src="https://media.discordapp.net/attachments/375453081631981568/808626634210410506/deejaytreefiddy.png" width=250>

    ChadMusic - The Chad Music Bot
</h1>

![GitHub](https://img.shields.io/github/license/200percentmicky/chadmusic)
[![Discord](https://img.shields.io/discord/449606846697963531.svg?label=&logo=discord&logoColor=ffffff&color=7389D8&labelColor=6A7EC2)](https://discord.gg/qQuJ9YQ)  
[![forthebadge](https://forthebadge.com/images/badges/made-with-javascript.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/0-percent-optimized.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/fuck-it-ship-it.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/mom-made-pizza-rolls.svg)](https://forthebadge.com)

Cool open-source music bot that's based on a [forked](https://github.com/200percentmicky/chadtube) build of **[DisTube.js](https://distube.js.org)**.

### **[Add my bot to your server!](https://discord.com/api/oauth2/authorize?client_id=375450533114413056&permissions=1005972566&scope=applications.commands%20bot)**

## ✨ Features
* Supports up to 700+ websites.
* Add multiple filters to the player.
* Alter filter values during playback.
* Unlimited volume! 😂👌
* DJ commands to control the player.
* Queue and track length limits.
* Advanced queue management.
* Slash commands lol
* ???
* Profit!

# All of this looks cool! Can I self host this?
Absolutely! Follow the instructions below to get started.

The bot requires the following to work:
- ffmpeg
- yt-dlp (The bot should install this for you.)
- git
- Node.JS 16.9.0+
- Python 3.7+ (for yt-dlp to work)

If you're running the bot on Linux, the following packages are required.
- `make`
- `gcc`
- `clang`
- `g++`

## Directions
1. Clone this repo.
2. Create a bot application **[here](https://discord.com/developers)**, and copy the bot's token.
3. Fill out the `.env.example` file and rename it to `.env`
4. Type `npm run build` to install all dependencies.
    - It's safe to ignore any TypeScript errors that occur during the build. If any other errors occur during the process, please open an issue regarding this.

5. Type `npm run bot` or `node index` to run the bot. (Consider using a process manager like PM2 to keep it running in the background.)

