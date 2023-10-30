# Downloading FFmpeg
ChadMusic uses FFmpeg to encode incoming audio data. FFmpeg is also used to apply filters to an active player. FFmpeg must be installed for the bot to play any audio.

## Windows
You can download the latest builds of FFmpeg for Windows below.

[Latest FFmpeg Binaries](https://github.com/BtbN/FFmpeg-Builds/releases){ .md-button .md-button--primary }

## Mac
You can get the latest stable release of FFmpeg from Homebrew.

```
$ brew install ffmpeg
```

## Linux
**Ubuntu**

FFmpeg is available on Ubuntu's repositories. If you're running on LTS versions of Ubuntu, take note that these builds tend to be older.

```
$ sudo apt update
$ sudo apt install ffmpeg
```

**Debian**

FFmpeg is available in Debian's repositories. Debian stable may provide an older build of FFmpeg. If you prefer the latest builds, consider switching to `testing`.

```
$ sudo apt-get install ffmpeg
```

**Fedora**

FFmpeg is available on Fedora's repositories.

```
$ sudo dnf install ffmpeg-free
```

However, you may want to install the build from RPM Fusion instead.

Add the RPM Fusion repo to your system.

```
$ sudo dnf -y install https://download1.rpmfusion.org/free/fedora/rpmfusion-free-release-$(rpm -E %fedora).noarch.rpm
$ sudo dnf -y install https://download1.rpmfusion.org/nonfree/fedora/rpmfusion-nonfree-release-$(rpm -E %fedora).noarch.rpm
```

Then continue installing FFmpeg as normal.

```
$ sudo dnf -y install ffmpeg
```

