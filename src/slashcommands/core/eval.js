const { SlashCommand, CommandOptionType } = require('slash-create');

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
      description: 'Evaluates and executes Javascript code. [Bot Owner Only]',
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
    const client = this.creator.client;
    if (ctx.user.id !== client.ownerID) return client.ui.ctx(ctx, client, 'no', true, 'That command can only be used by the bot owner.');

    const guild = client.guilds.cache.get(ctx.guildID);
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
        evaled = require('util').inspect(evaled, { depth: 1, sorted: true, maxArrayLength: 5 });
      }

      const t2 = process.hrtime(t1);
      const end = (t2[0] * 1000000000 + t2[1]) / 1000000;

      if (code.includes('.token')) {
        try {
          await ctx.send(':warning: Tokens are sensitive. Check the console, or the logs for the output.', { ephemeral: true });
        } catch (err) {
          if (err.name === 'DiscordAPIError') return;
        }
        return this.client.logger.info('Took %s ms. to complete.\n%d', end, `Input: ${code}\n${clean(evaled)}`);
      } else {
        const result = clean(evaled);
        if (result.length > 2000) {
          client.logger.info('Took %s ms. to complete.\n%d', end, `Input: ${code}\n${clean(evaled)}`);
          return await ctx.send(':warning: Out too large. Check the console, or logs for the output.', { ephemeral: true });
        } else {
          return await ctx.send(`\`\`\`js\n// ✅ Evaluated in ${end} ms.\n${result}\`\`\``, { ephemeral: true });
        }
      }
    } catch (err) {
      await ctx.send(`\`\`\`js\n// ❌ Error during eval\n${err.name}: ${err.message}\`\`\``, { ephemeral: true });
    }
  }
}

module.exports = CommandEval;
