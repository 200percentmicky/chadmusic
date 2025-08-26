/// ChadMusic
/// Copyright (C) 2025  Micky | 200percentmicky
///
/// This program is free software: you can redistribute it and/or modify
/// it under the terms of the GNU General Public License as published by
/// the Free Software Foundation, either version 3 of the License, or
/// (at your option) any later version.
///
/// This program is distributed in the hope that it will be useful,
/// but WITHOUT ANY WARRANTY; without even the implied warranty of
/// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
/// GNU General Public License for more details.
///
/// You should have received a copy of the GNU General Public License
/// along with this program.  If not, see <https://www.gnu.org/licenses/>.

const { SlashCommand, CommandOptionType } = require('slash-create');
const { oneLine, stripIndents } = require('common-tags');
const { version } = require('../../../package.json');

/* eslint-disable no-unused-vars */

// System Info for debugging.
const os = require('node:os');
const si = require('systeminformation');

// Importing libraries for eval use.
const Discord = require('discord.js');
const _ = require('lodash');
const prettyBytes = require('pretty-bytes');
const prettyMs = require('pretty-ms');
const colonNotation = require('colon-notation');
const commonTags = require('common-tags');
const { ButtonStyle } = require('discord.js');
const prettyms = require('pretty-ms');

// Mainly for version info in the about and debug commands.
const bot = require('../../../package.json');
const sc = require('slash-create/package.json');
const akairo = require('discord-akairo/package.json');
const distube = require('../../../node_modules/distube/package.json'); // Temporary

class CommandCore extends SlashCommand {
    constructor (creator) {
        super(creator, {
            name: 'core',
            description: 'Core commands.',
            options: [
                {
                    type: CommandOptionType.SUB_COMMAND_GROUP,
                    name: 'owner',
                    description: 'Commands reserved for the application owner only.',
                    options: [
                        {
                            type: CommandOptionType.SUB_COMMAND,
                            name: 'eval',
                            description: 'Executes Javascript code.',
                            options: [
                                {
                                    type: CommandOptionType.STRING,
                                    name: 'code',
                                    description: 'The code to execute. With great power comes great responsibility.',
                                    required: true
                                }
                            ]
                        },
                        {
                            type: CommandOptionType.SUB_COMMAND,
                            name: 'shutdown',
                            description: 'Shuts down the bot.',
                            options: [
                                {
                                    type: CommandOptionType.STRING,
                                    name: 'reason',
                                    description: 'The reason for the shutdown.'
                                }
                            ]
                        },
                        {
                            type: CommandOptionType.SUB_COMMAND,
                            name: 'reload',
                            description: 'Reloads everything without restarting the bot.'
                        },
                        {
                            type: CommandOptionType.SUB_COMMAND,
                            name: 'setavatar',
                            description: "Changes the bot's avatar. If no arguments are provided, removes the avatar.",
                            options: [
                                {
                                    type: CommandOptionType.ATTACHMENT,
                                    name: 'image',
                                    description: 'The attached image to use for the avatar. Supports GIF, JPEG, or PNG formats.'
                                },
                                {
                                    type: CommandOptionType.STRING,
                                    name: 'url',
                                    description: 'The URL of an image to use for the avatar. Supports GIF, JPEG, or PNG formats.'
                                }
                            ]
                        },
                        {
                            type: CommandOptionType.SUB_COMMAND,
                            name: 'setbanner',
                            description: "Changes the bot's profile banner. If no arguments are provided, removes the banner.",
                            options: [
                                {
                                    type: CommandOptionType.ATTACHMENT,
                                    name: 'image',
                                    description: 'The attached image to use for the banner. Supports GIF, JPEG, or PNG formats.'
                                },
                                {
                                    type: CommandOptionType.STRING,
                                    name: 'url',
                                    description: 'The URL of an image to use for the banner. Supports GIF, JPEG, or PNG formats.'
                                }
                            ]
                        },
                        {
                            type: CommandOptionType.SUB_COMMAND,
                            name: 'setgame',
                            description: "Changes the bot's playing status.",
                            options: [
                                {
                                    type: CommandOptionType.STRING,
                                    name: 'status',
                                    description: 'The new status to set.',
                                    required: true
                                },
                                {
                                    type: CommandOptionType.STRING,
                                    name: 'type',
                                    description: 'The type of status to set.',
                                    choices: [
                                        {
                                            name: 'Competing',
                                            value: Discord.ActivityType.Competing.toString()
                                        },
                                        {
                                            name: 'Custom',
                                            value: Discord.ActivityType.Custom.toString()
                                        },
                                        {
                                            name: 'Playing',
                                            value: Discord.ActivityType.Playing.toString()
                                        },
                                        {
                                            name: 'Listening',
                                            value: Discord.ActivityType.Listening.toString()
                                        },
                                        {
                                            name: 'Watching',
                                            value: Discord.ActivityType.Watching.toString()
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            type: CommandOptionType.SUB_COMMAND,
                            name: 'sudo',
                            description: 'Grants or denies the bot owner DJ permissions in the given server.'
                        }
                    ]
                },
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'ping',
                    description: "Pong! Measures the bot's latency."
                },
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'license',
                    description: 'View this program\'s license.'
                },
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'about',
                    description: `This application is running an instance of ChadMusic v${version}`
                },
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'debug',
                    description: 'Debugging information.'
                }
            ]
        });

        this.filePath = __filename;
    }

    async run (ctx) {
        let app;
        if (ctx.subcommands[0] === 'owner') {
            app = await this.client.application.fetch();
            if (this.client.owner?.id !== ctx.user.id) return ctx.send(`${process.env.EMOJI_NO} Only the owner of this application can use this command.`);
        }

        const guild = this.client.guilds.cache.get(ctx.guildID);
        const channel = guild.channels.cache.get(ctx.channelID);
        const member = guild.members.cache.get(ctx.user.id);

        const player = this.client.player;
        let queue;
        try {
            queue = player.getQueue(guild);
        } catch {}

        switch (ctx.subcommands[0]) {
        case 'owner': {
            switch (ctx.subcommands[1]) {
            case 'eval': {
                await ctx.defer(true);

                // Safety measure.
                if (!process.env.USE_EVAL) {
                    return ctx.send(oneLine`
                         ${process.env.EMOJI_INFO} The \`eval\` command is currently disabled. If you need to use this command, you can
                         enable it through the bot's environment variables by setting **USE_EVAL** to \`true\`.` + '\n' + oneLine`
                         ${process.env.EMOJI_WARN} Do not enable this command if you don't know what it does. Unless you know what you're
                         doing, if someone is telling you to enable it to have you run something, you're most likely being scammed.
                         `);
                }

                const clean = text => {
                    if (typeof (text) === 'string') { return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203)); } else { return text; }
                };

                const code = ctx.options.owner.eval.code;

                try {
                    // eslint-disable-next-line no-eval
                    let evaled = await eval(code);

                    if (typeof evaled !== 'string') {
                        evaled = require('util').inspect(evaled, { depth: 1, sorted: true, maxArrayLength: 5 });
                    }

                    let result = clean(evaled);

                    if (code.match(/\.token/gmi)) {
                        result = 'REACTED';
                    } else {
                        if (result.length >= 2000) {
                            const buffer = Buffer.from(`${result}`);
                            const timestamp = new Date();

                            try {
                                await ctx.send({ files: [{ file: buffer, name: `eval_${timestamp}.txt` }] });
                            } catch {
                                try {
                                    await member.user.send({ files: [{ data: buffer, name: `eval_${timestamp}.txt` }] });
                                    await ctx.send(`${process.env.EMOJI_WARN} Check your DMs for the output.`);
                                } catch {
                                    await ctx.send(`${process.env.EMOJI_ERROR} Unable to generate file. Check the logs or the console for the output.`);
                                }
                            } finally {
                                this.client.logger.info(`${clean(evaled)}`);
                            }
                        } else {
                            await ctx.send({ content: `\`\`\`js\n${result}\`\`\`` });
                        }
                    }
                } catch (err) {
                    return ctx.send({ content: `\`\`\`js\n${err}\`\`\`` });
                }
                break;
            }

            case 'reload': {
                let errored;
                let result;

                // Akairo Modules
                try {
                    // Everything must be unloaded before we can move on.
                    await this.client.commands.removeAll(); // Commands
                    await this.client.listeners.removeAll(); // Listeners

                    // Now we can load everything.
                    await this.client.commands.loadAll();
                    await this.client.listeners.loadAll();
                } catch (err) {
                    errored = true;
                    result += `${process.env.EMOJI_ERROR} Error reloading modules: \`${err.message}\``;
                }

                // Application Commands
                // Now to resync all slash commands and reload them.
                try {
                    await this.client.creator.syncCommands({
                        deleteCommands: process.env.DELETE_INVALID_COMMANDS === 'true' || false,
                        skipGuildErrors: true,
                        syncGuilds: true,
                        syncPermissions: true
                    });
                } catch (err) {
                    errored = true;
                    result = `${process.env.EMOJI_ERROR} Error syncing slash commands: \`${err.message}\`\n`;
                }

                await this.client.creator.commands.forEach(async cmd => {
                    try {
                        cmd.reload();
                    } catch (err) {
                        errored = true;
                        result = `${process.env.EMOJI_ERROR} Error reloading slash command \`${cmd.commandName}\`: \`${err.message}\`\n`;
                    }
                });

                if (!errored) result = `${process.env.EMOJI_OK} Reloaded all modules and application commands.`;
                await ctx.send(result);

                break;
            }

            case 'shutdown': {
                await ctx.send(`${process.env.EMOJI_WARN} Shutting down...`);

                let restartReport = ctx.options.owner.shutdown.reason;
                if (!restartReport) restartReport = 'No reason. See ya! 👋';

                try {
                    const errChannel = this.client.channels.cache.find(val => val.id === process.env.BUG_CHANNEL);
                    if (errChannel) await errChannel.send({ content: `${process.env.EMOJI_WARN} **Shutdown**\n\`\`\`js\n${restartReport}\`\`\`` });
                } catch {
                } finally {
                    this.client.logger.info(`[Shutdown] ${restartReport}`);
                    this.client.logger.warn('Shutting down...');
                    this.client.die();
                }
                break;
            }

            case 'setavatar': {
                await ctx.defer(true);

                try {
                    const newAvatar = ctx.attachments.first().url ??
                        ctx.options.owner.setavatar.url ??
                        this.client.user.defaultAvatarURL;

                    await this.client.user.setAvatar(newAvatar);
                    return this.client.ui.reply(ctx, 'ok', 'Avatar changed.');
                } catch (err) {
                    return this.client.ui.reply(ctx, 'error', `An error occured in the response: \`${err}\``);
                }
            }

            case 'setbanner': {
                await ctx.defer(true);

                const imageUrl = ctx.attachments.first().url ??
                    ctx.options.owner.setbanner.url;

                const setBanner = async (banner) => {
                    await this.client.rest.patch('/users/@me', {
                        body: {
                            banner
                        }
                    });
                };

                if (imageUrl) {
                    try {
                        let imageFormat;
                        try {
                            imageFormat = imageUrl.match(/(gif|jpg|png)/g)[0];
                        } catch {
                            return this.client.ui.reply(ctx, 'error', 'Supported image formats are GIF, JPEG, or PNG.');
                        }

                        const image = await fetch(imageUrl).catch(() => {});
                        const buffer = Buffer.from(await image.arrayBuffer()).toString('base64');

                        await setBanner(`data:image/${imageFormat};base64,` + buffer);
                        return this.client.ui.reply(ctx, 'ok', 'Banner changed.');
                    } catch (err) {
                        return this.client.ui.reply(ctx, 'error', `An error occured in the response: \`${err}\``);
                    }
                } else {
                    await setBanner(null);
                    return this.client.ui.reply(ctx, 'ok', 'Banner changed.');
                }
            }

            case 'setgame': {
                await ctx.defer(true);

                try {
                    this.client.user.setActivity(ctx.options.owner.setgame.status, {
                        type: parseInt(ctx.options.owner.setgame.type ?? Discord.ActivityType.Custom)
                    });
                    return this.client.ui.reply(ctx, 'ok', 'Activity changed.');
                } catch (err) {
                    return this.client.ui.reply(ctx, 'error', `Failed to set status: \`${err}\``);
                }
            }

            case 'sudo': {
                const sudo = this.client.player.sudoAccess;

                if (sudo.includes(guild.id)) {
                    _.remove(sudo, g => {
                        return g === guild.id;
                    });
                    return this.client.ui.reply(ctx, 'info', 'Disabled sudo access on this server.');
                }

                if (await this.client.utils.isDJ(channel, member)) {
                    return this.client.ui.reply(ctx, 'warn', 'You\'re already a DJ in this server.');
                }

                sudo.push(guild.id);
                return this.client.ui.reply(ctx, 'info', 'Enabled sudo access on this server.');
            }
            }
            break;
        }

        case 'ping': {
            return ctx.send(stripIndents`
                ${process.env.EMOJI_OK} **Pong!**
                :heartbeat: \`${Math.round(this.client.ws.ping)}ms.\``
            );
        }

        case 'license': {
            await ctx.defer(true);

            const urlGithub = new Discord.ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setURL('https://github.com/200percentmicky/chadmusic')
                .setLabel('GitHub');

            const support = new Discord.ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setURL('https://discord.com/invite/qQuJ9YQ')
                .setLabel('Support Server');

            const docsButton = new Discord.ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setURL('https://200percentmicky.github.io/chadmusic')
                .setLabel('Documentation');

            const actionRow = new Discord.ActionRowBuilder()
                .addComponents([urlGithub, support, docsButton]);

            return ctx.send({
                content: stripIndents`
                This application is running an instance of **[ChadMusic](https://github.com/200percentmicky/chadmusic)**
                
                This program is licensed under the GNU General Public License version 3.

                ChadMusic
                Copyright (C) 2025  Micky | 200percentmicky
    
                This program is free software: you can redistribute it and/or modify
                it under the terms of the GNU General Public License as published by
                the Free Software Foundation, either version 3 of the License, or
                (at your option) any later version.
                
                This program is distributed in the hope that it will be useful,
                but WITHOUT ANY WARRANTY; without even the implied warranty of
                MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
                GNU General Public License for more details.
                
                You should have received a copy of the GNU General Public License
                along with this program.  If not, see <https://www.gnu.org/licenses/>.
                `,
                components: [actionRow]
            });
        }

        case 'about': {
            app = this.client.application;

            if (!this.client.owner) await this.client.application.fetch();

            const owner = this.client.owner instanceof Discord.Team ? `${this.client.owner?.name}` : `${this.client.owner?.tag.replace(/#0{1,1}$/, '')} (${this.client.owner?.id})`;
            // Had to fetch this for some reason...
            const botColor = await this.client.guilds.cache.get(ctx.guildID).members.me.displayColor ?? null;
            const aboutembed = new Discord.EmbedBuilder()
                .setColor(botColor)
                .setAuthor({
                    name: 'ChadMusic',
                    iconURL: this.client.user.avatarURL({ dynamic: true })
                })
                .setDescription('Self-hostable music bot for chaotic social network. ')
                .addFields({
                    name: '🎶 Features',
                    value: stripIndents`
                    :white_small_square: Supports up to 700+ websites.
                    :white_small_square: Add multiple filters to the player.
                    :white_small_square: Alter filter values during playback.
                    :white_small_square: Unlimited volume! :joy::ok_hand:
                    :white_small_square: Hide tracks by silently adding them. 🤫
                    :white_small_square: DJ commands to control the player.
                    :white_small_square: Queue and track length limits.
                    :white_small_square: Advanced queue management.
                    :white_small_square: Slash commands lol
                    :white_small_square: ???
                    :white_small_square: Profit!
                    `
                }, {
                    name: `${process.env.EMOJI_INFO} Stats`,
                    value: stripIndents`
                    **Client:** ${this.client.user.tag.replace(/#0{1,1}$/, '')} (\`${this.client.user.id}\`)
                    **Bot Version:** ${this.client.version}
                    **Node.js:** ${process.version}
                    **Discord.js:** ${Discord.version}
                    **slash-create:** ${sc.version}
                    **Akairo Framework:** ${akairo.version}
                    **DisTube.js:** ${this.client.player.version}
                    **Voice Connections:** ${this.client.vc.voices.collection.size}
                    **Uptime:** ${prettyms(this.client.uptime, { verbose: true })}
                    `,
                    inline: true
                })
                .setThumbnail('https://media.discordapp.net/attachments/375453081631981568/808626634210410506/deejaytreefiddy.png')
                .setFooter({
                    text: `The owner of this instance is ${owner}`,
                    iconURL: this.client.owner instanceof Discord.Team ? this.client.owner?.iconURL() : this.client.owner?.avatarURL({ dynamic: true })
                });

            const urlGithub = new Discord.ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setURL('https://github.com/200percentmicky/chadmusic')
                .setLabel('GitHub');

            const support = new Discord.ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setURL('https://discord.com/invite/qQuJ9YQ')
                .setLabel('Support Server');

            const docsButton = new Discord.ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setURL('https://200percentmicky.github.io/chadmusic')
                .setLabel('Documentation');

            const actionRow = new Discord.ActionRowBuilder()
                .addComponents([urlGithub, support, docsButton]);

            return ctx.send({ embeds: [aboutembed], components: [actionRow] });
        }

        case 'debug': {
            await ctx.defer(true);
            const osSi = await si.osInfo();
            const memory = await si.mem();
            const user = os.userInfo();
            app = this.client.application;
            if (!this.client.owner) await this.client.application.fetch();
            const owner = this.client.owner instanceof Discord.Team ? `${this.client.owner?.name}` : `${this.client.owner?.tag.replace(/#0{1,1}$/, '')} (${this.client.owner?.id})`;

            let kernel;
            let release;
            switch (osSi.platform) {
            case 'Windows':
                kernel = `Windows NT ${osSi.kernel} Service Pack ${osSi.servicepack}`;
                release = `${osSi.release} (Build ${osSi.build})`;
                break;
            case 'darwin':
                kernel = `Darwin ${osSi.kernel} ${osSi.build}`;
                release = `${osSi.codename} ${osSi.release}`;
                break;
            case 'linux':
                kernel = `Linux ${osSi.kernel} ${osSi.build}`;
                release = `${osSi.release} ${osSi.codename}`;
                break;
            }

            const data = stripIndents`
            === ChadMusic ===
            Version :: ${this.client.version}
            
            Client :: ${this.client.user.tag.replace(/#0{1,1}$/, '')} (ID: ${this.client.user.id})
            Owner :: ${owner}
            Node.js :: ${process.version}
            Discord.js :: ${Discord.version}
            DisTube :: ${player.version}
            Akairo Framework :: ${akairo.version}
            slash-create :: ${sc.version}
            Voice Connections :: ${this.client.vc.voices.collection.size}
            Uptime :: ${prettyms(this.client.uptime, { verbose: true })}
            Cluster ID :: ${this.client.cluster?.id ?? 'N/A'}
            Shard ID :: ${guild.shardId ?? 'N/A'}
        
            System
            ------
            CPU :: ${os.cpus()[0].model}
            CPU Speed :: ${os.cpus()[0].speed} MHz.
            Memory Total :: ${prettyBytes(memory.total)}
            Memory Used :: ${prettyBytes(memory.used)}
            Memory Free :: ${prettyBytes(memory.free)}
            Swap Total :: ${prettyBytes(memory.swaptotal)}
            Swap Used :: ${prettyBytes(memory.swapused)}
            Swap Free :: ${prettyBytes(memory.swapfree)}
            OS Version :: ${osSi.distro} ${release}
            Kernel :: ${kernel}
            Architechture :: ${osSi.arch}
            User :: ${user.username}
            Shell :: ${user.shell}
            `;

            return ctx.send({ content: `\`\`\`asciidoc\n${data}\`\`\`` });
        }
        }
    }
}

module.exports = CommandCore;
