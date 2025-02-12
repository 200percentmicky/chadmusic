# Installing Node.js
The bot uses Node.js for it's runtime. The bot was written to run on LTS versions of Node.js, but the latest up to date version is also supported. Please note that the bot requires at least Node.js 20.

## Windows
You can download Node.js below.

[:fontawesome-brands-node-js: Download Node.js](https://nodejs.org/en/download){ .md-button .md-button--primary }

### Chocolatey
If you have Chocolatey installed, Node.js can be installed this way.
```
# Latest
choco install nodejs

# LTS
choco install nodejs-lts
```

### Scoop
If you have Scoop installed, Node.js is available in the `main` bucket.
```
# Latest
scoop install nodejs

# LTS
scoop install nodejs-lts
```

## Linux and Mac
There are binaries available for macOS by clicking the button above. For most cases, you can use `nvm` to install and manage several installations of Node.js on both macOS and Linux. `nvm` can also be used on Windows, but you will need to use Windows Subsystem for Linux since `nvm` doesn't maintain Windows executables. To install `nvm`, please visit the repo below for instructions.

[:simple-github: nvm GitHub](https://github.com/nvm-sh/nvm){ .md-button }

Once `nvm` is installed, installing Node.js is as simple as running the following:

```
nvm install --latest
```

Alternatively, you can install the latest LTS version by running the following:

```
nvm install --lts
```
