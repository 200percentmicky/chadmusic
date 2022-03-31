const { SlashCommand, CommandOptionType } = require('slash-create');
const { oneLine } = require('common-tags');

/* eslint-disable no-unused-vars */
const Discord = require('discord.js');
const _ = require('lodash');
const __ = require('underscore');
const prettyBytes = require('pretty-bytes');
const prettyMs = require('pretty-ms');
const colonNotation = require('colon-notation');
const commonTags = require('common-tags');

class CommandEval extends SlashCommand {
    constructor (creator) {
        super(creator, {
            name: 'eval',
            description: '[Owner Only] Evaluates and executes Javascript code.',
            options: [
                {
                    type: CommandOptionType.STRING,
                    name: 'code',
                    required: true,
                    description: 'The code to execute. With great power comes great responsibility.'
                }
            ]
        });

        this.filePath = __filename;
    }

    async run (ctx) {
        const app = await this.client.application.fetch();
        if (app.owner?.id !== ctx.user.id) return ctx.send('🚫 That command can only be used by the bot owner.', { ephemeral: true });
        if (!process.env.USE_EVAL) {
            return ctx.send(oneLine`
            ${process.env.EMOJI_INFO} The \`eval\` command is currently disabled. If you need to use this command, you can
            enable it through the bot's environment variables by setting **USE_EVAL** to \`true\`.` + '\n' + oneLine`
            ${process.env.EMOJI_WARN} Do not enable this command if you don't know what it does. Unless you know what you're
            doing, if someone is telling you to enable it to have you run something, you're most likely being scammed.
            `, { ephemeral: true });
        }

        const guild = this.client.guilds.cache.get(ctx.guildID);
        const channel = guild.channels.cache.get(ctx.channelID);
        const member = guild.members.cache.get(ctx.user.id);

        const t1 = process.hrtime();
        const clean = text => {
            if (typeof (text) === 'string') { return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203)); } else { return text; }
        };

        // const args = message.content.split(/ +/g)
        const code = ctx.options.code;

        try {
            // eslint-disable-next-line no-eval
            let evaled = await eval(code);

            if (typeof evaled !== 'string') {
                evaled = require('util').inspect(evaled, { depth: 0, sorted: true, maxArrayLength: 5 });
            }

            const t2 = process.hrtime(t1);
            const end = (t2[0] * 1000000000 + t2[1]) / 1000000;

            if (code.match(/\.token/gmi)) {
                return ctx.send('⛔ `REACTED`', { ephemeral: true }); // I'm not supporting that...
            } else {
                const result = clean(evaled);
                if (result.length > 2000) {
                    this.creator.logger.info('[eval] Took %s ms. to complete.\n%s', end, `Input: ${code}\n${clean(evaled)}`);
                    return await ctx.send(':warning: Out too large. Check the console, or logs for the output.', { ephemeral: true });
                } else {
                    return await ctx.send(`\`\`\`js\n// ✅ Evaluated in ${end} ms.\n${result}\`\`\``, { ephemeral: true });
                }
            }
        } catch (err) {
            await ctx.send(`\`\`\`js\n// ❌ Error during eval\n${err.name}: ${err.message}\`\`\``, { ephemeral: true });
            this.creator.logger.error('[eval] Error during eval: %s', err);
        }
    }
}

module.exports = CommandEval;
