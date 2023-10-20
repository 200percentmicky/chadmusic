# Installing Dependencies
At this point, you should be ready to install the bot's dependencies. Before you begin, you will need to install some additional build tools to your system.

!!! abstract "Windows"

    When installing Node.js, the additional build tools should have already been provided to you during installation as an option. If for any reason they were not installed when installing Node.js, you will need to install the Visual Studio Build Tools seperately, specifically the **Desktop Development with C++ module**. You can install it from the Visual Studio installer.

    [Visual Studio Installer](https://aka.ms/vs/17/release/vs_BuildTools.exe){ .md-button }

    Please note that you don't actually need to install Visual Studio itself. You just need to install the specific build tools.

!!! abstract "Mac"

    You'll need to install the following packages to your system through Homebrew.

    ```
    $ brew install make gcc llvm
    ```

!!! abstract "Linux"

    You'll need to install the following packages to your system.

    ```
    Debian/Ubuntu
    $ sudo apt install make gcc clang g++
    ```

    ```
    Fedora
    $ sudo dnf install make gcc clang gcc-c++
    ```

Once you have finished installing the additional build tools, you can now run the following to install all of the bot's dependencies.

```
$ npm run build
```

!!! note "Error regarding "yarn not found""

    If an error occurs regarding yarn not being found, you'll need to install yarn on your system. Use npm to install yarn globally:

    ```
    $ npm install -g yarn
    ```

    Once you installed yarn, upgrade it to the latest version:
    ```
    $ yarn set version stable
    ```
