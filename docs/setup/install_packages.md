# Installing Dependencies
At this point, you should be ready to install the bot's dependencies. Before you begin, you will need to install some additional build tools to your system.

!!! info "Error regarding "yarn not found""

    Some packages require yarn to install them. If you received an error about yarn not being installed, you'll need to install it on your system.
    
    First, enable Corepack on your system. This requires administrator privileges.
    ```
    # corepack enable
    ```

    Then, update yarn to the latest version.
    ```
    $ yarn set version stable
    ```

## Windows
When installing Node.js, the additional build tools should have already been provided to you during installation as an option. If for any reason they were not installed when installing Node.js, you will need to install the Visual Studio Build Tools seperately, specifically the **Desktop Development with C++ module**. You can install it from the Visual Studio installer.

[Visual Studio Installer](https://aka.ms/vs/17/release/vs_BuildTools.exe){ .md-button }

Please note that you don't actually need to install Visual Studio itself. You just need to install the specific build tools. Once you have finished installing the build tools, you can now run the following to install the bot's dependencies.

```
$ npm run build
```

## Mac
You'll need to install the following packages to your system through Homebrew.

```
$ brew install make gcc llvm
```

Once you have finished that, you can now install the bot's dependencies as normal.

```
$ npm run build
```

## Linux
You'll need to install the following packages to your system.

```
Debian/Ubuntu
$ sudo apt install make gcc clang g++
```

```
Fedora
$ sudo dnf install make gcc clang gcc-c++
```

Once you have everything you need installed to the system, you can now run the following to install the bot's dependencies.

```
$ npm run build
```



