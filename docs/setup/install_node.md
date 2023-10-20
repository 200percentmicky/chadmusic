# Installing Node.js
The bot uses Node.js for it's runtime. The bot was written to work with the latest LTS version of Node.js, but the latest up to date version is also supported.

!!! warning
    Please note that the bot requires at least Node.js 18 or up. Any version below that is not supported, including Node.js 16 which is has reached end-of-life.

## Windows
You can download the latest Node.js binaries below.

[:fontawesome-brands-node-js: Download Node.js](https://nodejs.org/en/download){ .md-button .md-button--primary }

## Linux and Mac
There are binaries available for macOS by clicking the button above. For most cases, you can use `nvm` to install and manage several installations of Node.js. The same can be said for Windows, however `nvm` doesn't currently manage Windows binaries. If you use `nvm` on Windows, you will need to use the Windows Subsystem for Linux. You can visit `nvm`'s repo below.

[:simple-github: nvm GitHub](https://github.com/nvm-sh/nvm){ .md-button }

Once `nvm` is installed, installing an LTS version of Node.js is as simple as running the following:

```
$ nvm install --lts
```
