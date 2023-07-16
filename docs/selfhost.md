# Self-host Instructions

To run your own instance of ChadMusic, you will need the following installed on the system you plan to run the bot on:

- Node.js v16.9.0 or greater
- npm v8.0.0 or greater.
- git
- ffmpeg

## Installation

### Windows

1. Download and install Node.js [here](https://nodejs.org).

?> The latest LTS version is recommended for most cases.

!> Make sure you include the additional build tools when installing Node.js. Many of the bot's dependencies require them. If for any reason they were not installed, you will need to install the Visual Studio Build Tools, specifically the **Desktop Development with C++ module**. You can install it from the Visual Studio installer [here](https://aka.ms/vs/17/release/vs_BuildTools.exe). You do not need to install Visual Studio itself, just the build tools.

2. Download and install git [here](https://git-scm.com)

3. Open a command prompt window.

4. Clone the bot's repository to your user folder, or to any directory that you have easy access to:
```
git clone https://github.com/200percentmicky/chadmusic.git
```

5. In the bot's root directory, run the following:
```
npm ci
```

6. Create an application on [Discord's Developer Portal](https://discord.com/developers).

7. Go to the bot section of your application, and copy the Token.

!> Your bot's token is similar to a password. Do not share your bot's token anywhere!

8. Fill out the `.env.example` file, and rename it to `.env`.

9. Start the bot by running either of the following:
```
npm run start
```
```
node index
```

### Linux or macOS
?> **Linux Users:** This section assumes that you're running the bot on a Debian/Ubuntu based distribution or a Red Hat based distribution, such as Fedora. However, this will work with any distribution.

?> **Mac Users:** You will need to install homebrew to install the build tools. You can get homebrew from [here](https://brew.sh/)

1. Install Node.js using [nvm](https://github.com/nvm-sh/nvm)

?> The latest LTS version is recommended in most cases. You can install the latest LTS version by running `nvm install --lts`

2. Open a terminal and install the following packages:
```
Debian/Ubuntu
$ sudo apt install make gcc clang g++
```
```
Fedora
$ sudo dnf install make gcc clang gcc-c++
```
```
macOS - Homebrew
$ brew install make gcc llvm
```

3. Clone the bot's repository to your user folder, or to any directory that you have easy access to:
```
$ git clone https://github.com/200percentmicky/chadmusic.git
```

4. In the bot's directory, run the following:
```
npm ci
```

5. Create an application on [Discord's Developer Portal](https://discord.com/developers).

6. Go to the bot section of your application, and copy the Token.

!> Your bot's token is similar to a password. Do not share your bot's token anywhere!

7. Fill out the `.env.example` file, and rename it to `.env`.

8. Start the bot by running either of the following:
```
npm run start
```
```
node index
```
