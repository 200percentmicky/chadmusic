# Starting the bot
If you followed the installation guide section-by-section, you should now be able to run the bot for the first time. You can start the bot by running the following command:

```
$ npm run bot
```

Alternatively, you can also launch the bot by using the following command:

```
$ node index.js
```

Your bot should now be online and ready to use. Head over to the Commands section to see what the bot can really do. Enjoy!

## Updating the bot

If a new version of the bot is release, run the following command to update the bot:

```
$ npm run update
```

If you want to switch to the `develop` branch, or update to the latest commit, run the following instead:

```
$ npm run update:dev
```

!!! warning

    If you made any changes to the bot, all changes will be discarded when running either of those scripts. Consider either of the following to keep your changes:
    
    * Stashing your changes, running `git pull`, and reapplying your stash.
    * Forking the bot to save your changes.