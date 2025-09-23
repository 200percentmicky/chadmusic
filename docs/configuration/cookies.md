# Cookies

!!! danger

    According to the **yt-dlp** developers,

    - By using your account with yt-dlp, you run the risk of it being banned (temporarily or permanently). Be mindful with the request rate and amount of downloads you make with an account. Use it only when necessary, or consider using a throwaway account.

    It has been made very clear that streaming videos outside of YouTube (in the case of using robots, botnets, or scrapers) goes against YouTube's [Terms of Service](https://www.youtube.com/static?template=terms). If you plan to use cookies, I do not take responsibility of the suspension or termination of your Google account. You are using this method at your own risk.

Cookies allows you to access private videos and private playlists (that you have access to only), add age-resticted tracks, and members-only content (if you have access to them).

There are two ways to add cookies and they both depend on whether the [`USE_YOUTUBE_PLUGIN`](env_variables.md#use_youtube_plugin) variable is set to `true` or `false`.

The first way is if you have `USE_YOUTUBE_PLUGIN` set to `true`. You can follow the guide below to add cookies this way. Create a `cookies.json` file in the bot's root directory and follow the instructions below.

[Add cookies.json](https://github.com/skick1234/DisTube/wiki/YouTube-Cookies){ .md-button }

The second way is if you have `USE_YOUTUBE_PLUGIN` set to `false`. Instead of creating a `cookies.json` file, create a `cookies.txt` file in the bot's root directory and follow the instructions from yt-dlp's wiki.

[Add cookies.txt](https://github.com/yt-dlp/yt-dlp/wiki/Extractors#exporting-youtube-cookies){ .md-button }

!!! info

    It's recommended to install [Deno](https://deno.com/) onto your system if you plan to play YouTube tracks this way. [Learn more.](https://github.com/yt-dlp/yt-dlp/issues/14404)
