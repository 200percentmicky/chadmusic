# Installing Node.js

ChadMusic requires Node.js 22.12.0 or later to run. Any version of Node.js after that can be used, but it's recommended to run the bot on the most recent LTS version. Standalone binaries and installers (except for Linux) are available to download. You can download them by clicking the button below.

[:fontawesome-brands-node-js: Download Node.js](https://nodejs.org/en/download){ .md-button .md-button--primary }

If you don't want to use the provided binaries or installers, there are many other alternative way to install Node.js.

## Windows

=== "Chocolatey"

    If you have [Chocolatey](https://chocolatey.org/) installed, you can install it this way.

    ```bash
    # Latest
    choco install nodejs

    # LTS
    choco install nodejs-lts
    ```

=== "Scoop"

    If you have [Scoop](https://scoop.sh/) installed, Node.js is available in the `main` bucket and it can be installed this way.

    ```bash
    # Latest
    scoop install nodejs

    # LTS
    scoop install nodejs-lts
    ```

## macOS

=== "nvm"

    [nvm](https://github.com/nvm-sh/nvm) is the most recommended way to install Node.js.

    ```bash
    # Install nvm
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.4/install.sh | bash

    # Install the latest LTS release.
    nvm install --lts
    ```

=== "fnm"

    [fnm](https://github.com/Schniz/fnm) works similar to nvm and can used to install Node.js this way.

    ```bash
    # Install fnm
    curl -fsSL https://fnm.vercel.app/install | bash

    # Installs Node.js 24
    fnm install 24
    ```

=== "Homebrew"

    If you have [Homebrew](https://brew.sh/) installed, you can install it this way.

    ```bash
    # Install Node.js 24.
    brew install node@24
    ```

## Linux

Many distributions provide their own build of Node.js in their repositories.

=== "Ubuntu/Debian"

    ```bash
    sudo apt update
    sudo apt install nodejs npm
    ```

=== "Fedora/Red Hat"

    ```bash
    sudo dnf install nodejs

    # Or, install a specific version.
    sudo dnf install nodejs24
    ```

=== "Arch Linux"

    ```bash
    sudo pacman -S nodejs npm
    ```

    More information is available in the [Arch wiki](https://wiki.archlinux.org/title/Node.js)

=== "openSUSE"

    ```bash
    sudo zypper install nodejs
    
    # Or, install a specific version.
    sudo zypper install nodejs24
    ```

=== "Rocky Linux"

    ```bash
    sudo dnf install nodejs
    ```

=== "Void Linux"

    ```bash
    sudo xbps-install -S
    sudo xbps-install nodejs

    # Or, install the LTS version
    sudo xbps-install nodejs-lts
    ```

There are also other ways to install Node.js outside of package managers.

=== "nvm"

    [nvm](https://github.com/nvm-sh/nvm) is the most recommended way to install Node.js.

    ```bash
    # Install nvm
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.4/install.sh | bash

    # Install the latest LTS release.
    nvm install --lts
    ```

=== "fnm"

    [fnm](https://github.com/Schniz/fnm) works similar to nvm and can used to install Node.js this way.

    ```bash
    # Install fnm
    curl -fsSL https://fnm.vercel.app/install | bash

    # Install Node.js 24
    fnm install 24
    ```

=== "NodeSource"

    NodeSource provides Node.js to a wide variety of Linux distributions. Follow the instructions on their website to get started.

    [:fontawesome-brands-node-js: NodeSource](https://nodesource.com/products/distributions){ .md-button .md-button--primary }
