# Downloading FFmpeg
ChadMusic uses FFMPEG to parse and play incoming audio data. For the bot to play any audio, you must install FFMPEG to the system you're hosting the bot on.

## Windows
You can download the latest builds of FFMPEG for Windows below. After downloading them, you'll need to add them to the `Path` system variable.

[Latest FFMPEG Binaries](https://github.com/BtbN/FFmpeg-Builds/releases){ .md-button .md-button--primary }

!!! warning

    Do not use `npm` to install FFMPEG. Libraries such as `ffmpeg-static` or `ffmpeg-binaries` are know to cause issues.

## Mac
You can download the binaries for Mac from the link above, or you can get the latest stable release of FFMPEG from Homebrew instead. If you're manually downloading the binaries yourself, make sure you add the binaries to PATH.

```
$ brew install ffmpeg
```

## Linux
You can also download the binaries for Linux from the link above, or you can installed them from your distro's repositories. If you're manually downloading the binaries yourself, make sure to add it to PATH and that it's executable.

### Ubuntu

FFMPEG is available on Ubuntu's repositories. If you're running on LTS versions of Ubuntu, take note that these builds tend to be older.

```
$ sudo apt update
$ sudo apt install ffmpeg
```

### Debian

FFMPEG is available in Debian's repositories. Debian stable may provide an older build of FFMPEG. If you prefer the latest builds, consider switching to `testing`.

```
$ sudo apt-get install ffmpeg
```

### Fedora

FFMPEG is available on Fedora's repositories.

```
$ sudo dnf install ffmpeg-free
```

However, you may want to install the build from RPM Fusion instead.

Add the RPM Fusion repo to your system.

```
$ sudo dnf -y install https://download1.rpmfusion.org/free/fedora/rpmfusion-free-release-$(rpm -E %fedora).noarch.rpm
$ sudo dnf -y install https://download1.rpmfusion.org/nonfree/fedora/rpmfusion-nonfree-release-$(rpm -E %fedora).noarch.rpm
```

Then continue installing FFMPEG as normal.

```
$ sudo dnf -y install ffmpeg
```

