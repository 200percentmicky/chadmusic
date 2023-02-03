/**
 *  ChadMusic - The Chad Music Bot
 *  Copyright (C) 2022  Micky D. | @200percentmicky | Micky-kun#3836
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

/* eslint-disable no-unused-vars */
const { SlashCommand, CommandOptionType } = require('slash-create');
const { oneLine } = require('common-tags');
const os = require('os');
const si = require('systeminformation');

const Discord = require('discord.js');
const _ = require('lodash');
const __ = require('underscore');
const prettyBytes = require('pretty-bytes');
const prettyMs = require('pretty-ms');
const colonNotation = require('colon-notation');
const commonTags = require('common-tags');
const { ButtonStyle } = require('discord.js');

class CommandOwner extends SlashCommand {
    constructor (creator) {
        super(creator, {
            name: 'owner',
            description: 'Commands that are reserved for the owner of this application.',
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
                }
            ],
            deferEphemeral: true
        });

        this.filePath = __filename;
    }

    async run (ctx) {
        const app = await this.client.application.fetch();
        if (app.owner?.id !== ctx.user.id) return ctx.send('🚫 Only the owner of this application can use this command.');

        switch (ctx.subcommands[0]) {
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

            const guild = this.client.guilds.cache.get(ctx.guildID);
            const channel = guild.channels.cache.get(ctx.channelID);
            const member = guild.members.cache.get(ctx.user.id);

            const t1 = process.hrtime();
            const clean = text => {
                if (typeof (text) === 'string') { return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203)); } else { return text; }
            };

            // const args = message.content.split(/ +/g)
            const code = ctx.options.eval.code;

            try {
                // eslint-disable-next-line no-eval
                let evaled = await eval(code);

                if (typeof evaled !== 'string') {
                    evaled = require('util').inspect(evaled, { depth: 0, sorted: true, maxArrayLength: 5 });
                }

                const t2 = process.hrtime(t1);
                const end = (t2[0] * 1000000000 + t2[1]) / 1000000;

                if (code.match(/\.token/gmi)) {
                    return ctx.send('⛔ `REACTED`'); // I'm not supporting that...
                } else {
                    const result = clean(evaled);
                    if (result.length > 2000) {
                        this.client.logger.info('[eval] Took %s ms. to complete.\n%s', end, `Input: ${code}\n${clean(evaled)}`);
                        return await ctx.send(':warning: Out too large. Check the console, or logs for the output.');
                    } else {
                        return await ctx.send(`\`\`\`js\n${result}\`\`\``);
                    }
                }
            } catch (err) {
                await ctx.send(`\`\`\`js\n// ❌ Error during eval\n${err.name}: ${err.message}\`\`\``);
                this.client.logger.error('[eval] Error during eval: %s', err);
            }
            break;
        }

        case 'reload': {
            // Akairo Modules
            await ctx.defer(true);
            let result = '✅ All modules and application commands have been reloaded.';

            try {
                // Everything must be unloaded before we can move on.
                await this.client.commands.removeAll(); // Commands
                await this.client.inhibitors.removeAll(); // Inhibitors
                await this.client.listeners.removeAll(); // Listeners

                // Now we can load everything.
                await this.client.commands.loadAll();
                await this.client.inhibitors.loadAll();
                await this.client.listeners.loadAll();
            } catch (err) {
                await ctx.sendFollowUp({ content: `❌ Error reloading modules: \`${err.message}\`` });
                result = '❌ Errors occured while reloading modules and slash commands.';
            }

            // Application Commands
            // Now to resync all slash commands and reload them.
            try {
                await this.client.creator.syncCommandsAsync({
                    deleteCommands: process.env.DELETE_INVALID_COMMANDS === 'true' || false,
                    skipGuildErrors: true,
                    syncGuilds: true,
                    syncPermissions: true
                });
            } catch (err) {
                await ctx.sendFollowUp({ content: `❌ Error syncing slash commands: \`${err.message}\`\n` });
                result = '❌ Errors occured while reloading modules and slash commands.';
            }

            await this.client.creator.commands.forEach(async cmd => {
                try {
                    cmd.reload();
                } catch (err) {
                    await ctx.sendFollowUp({ content: `❌ Error reloading slash command \`${cmd.commandName}\`: \`${err.message}\`\n` });
                    result = '❌ Errors occured while reloading modules and slash commands.';
                }
            });

            await ctx.sendFollowUp(result);

            break;
        }

        case 'shutdown': {
            await ctx.send('⚠ Shutting down...');
            this.client.logger.warn('Cleaning up before shutting down...');
            if (ctx.options.shutdown.reason) {
                const errChannel = this.client.channels.cache.find(val => val.id === process.env.BUG_CHANNEL);
                const embed = new Discord.EmbedBuilder()
                    .setColor(process.env.COLOR_INFO)
                    .setTitle('🔄 Restart')
                    .setDescription(`\`\`\`js\n${ctx.options.shutdown.reason}\`\`\``)
                    .setTimestamp();
                await errChannel.send({ embeds: [embed] });
                this.client.logger.warn('Shutdown reason: %s', ctx.options.shutdown.reason);
            }
            this.client.destroy();
            this.client.logger.warn('Shutting down...');
            process.exit(0);
        }
        }
    }
}

module.exports = CommandOwner;
