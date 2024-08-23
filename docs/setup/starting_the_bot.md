# Starting the bot
If you followed the installation guide section-by-section, you should now be able to run the bot for the first time. Before you start your bot, you must set your bot's token and application ID in the bot's environment variables. You can learn more about how to configure your bot's variables in **[Configuration > Environment Variables](../configuration/env_variables.md)**. Once you finished configuring your bot's variables, you can start the bot by running the following command:

```
npm run bot
```

Alternatively, you can also launch the bot by using the following command:

```
node index.js
```

Your bot should now be online and ready to use. Head over to the Commands section to see what the bot can really do. Enjoy!

## Updating the bot

If a new version of the bot is release, run the following command to update the bot:

```
npm run update
```

If you want to live on the edge and use a version that's in development, you can switch to the `develop` branch by running the following:

```
npm run update:dev
```

!!! warning

    If you're wanting to use the `develop` branch in production, bugs or broken features may be present. If you want to report any bugs or broken features, please report the issue [here](https://github.com/200percentmicky/chadmusic/issues).
