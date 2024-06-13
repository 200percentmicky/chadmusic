# Downloading FFmpeg
ChadMusic uses ffmpeg to parse and play incoming audio data. For the bot to play any audio, you must install ffmpeg to the system you're hosting the bot on.

!!! warning

    Do not use `npm` to install ffmpeg. Libraries such as `ffmpeg-static` or `ffmpeg-binaries` are know to cause issues.

## Windows
You can download the latest builds of ffmpeg for Windows below. After downloading them, you'll need to add them to your `Path` system variable.

[Latest ffmpeg Binaries](https://github.com/BtbN/FFmpeg-Builds/releases){ .md-button .md-button--primary }

## Mac
You can download the binaries for Mac from the link above, or you can get the latest stable release of ffmpeg from Homebrew instead. If you're manually downloading the binaries yourself, make sure you add the binaries to PATH.

```
brew install ffmpeg
```

## Linux
You can also download the binaries for Linux from the link above, or you can installed them from your distro's repositories. If you're manually downloading the binaries yourself, make sure to add it to PATH and that it's executable.

### Ubuntu

Ffmpeg is available on Ubuntu's repositories. If you're running on LTS versions of Ubuntu, take note that these builds tend to be older.

```
sudo apt update
sudo apt install ffmpeg
```

### Debian

Ffmpeg is available in Debian's repositories, but Debian stable may provide an older build. If you prefer the latest builds and your comfortable with it, consider switching to Debian testing instead.

```
sudo apt-get install ffmpeg
```

### Fedora

Ffmpeg is available on Fedora's repositories.

```
sudo dnf install ffmpeg-free
```

However, you may want to install the build from RPM Fusion instead.

Add the RPM Fusion repo to your system.

```
sudo dnf -y install https://download1.rpmfusion.org/free/fedora/rpmfusion-free-release-$(rpm -E %fedora).noarch.rpm
sudo dnf -y install https://download1.rpmfusion.org/nonfree/fedora/rpmfusion-nonfree-release-$(rpm -E %fedora).noarch.rpm
```

Then continue installing Ffmpeg as normal.

```
sudo dnf -y install ffmpeg
```

