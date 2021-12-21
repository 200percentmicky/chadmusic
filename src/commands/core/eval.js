const { Command } = require('discord-akairo');

/* eslint-disable no-unused-vars */
const Discord = require('discord.js');
const _ = require('lodash');
const __ = require('underscore');
const prettyBytes = require('pretty-bytes');
const prettyMs = require('pretty-ms');
const colonNotation = require('colon-notation');
const commonTags = require('common-tags');

module.exports = class CommandEval extends Command {
  constructor () {
    super('eval', {
      aliases: ['eval'],
      ownerOnly: true,
      description: {
        text: 'Executes Javascript code.',
        usage: '<code>',
        details: commonTags.stripIndents`
        **Loaded Packages:**
        \`Discord\` - discord.js
        \`_\` - lodash
        \`__\` - underscore
        \`prettyBytes\` - pretty-bytes
        \`prettyMs\` - prettyMs
        \`colonNotation\` - colon-notation
        \`commonTags\` - common-tags`
      },
      category: '💻 Core',
      args: [
        {
          type: 'string',
          id: 'code',
          match: 'text'
        }
      ]
    });
  }

  async exec (message, args) {
    const t1 = process.hrtime();
    const clean = text => {
      if (typeof (text) === 'string') { return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203)); } else { return text; }
    };

    // const args = message.content.split(/ +/g)
    const code = args.code;

    try {
      // eslint-disable-next-line no-eval
      let evaled = eval(code);

      if (typeof evaled !== 'string') {
        evaled = require('util').inspect(evaled, { depth: 0, sorted: true, maxArrayLength: 5 });
      }

      message.channel.sendTyping();

      const t2 = process.hrtime(t1);
      const end = (t2[0] * 1000000000 + t2[1]) / 1000000;

      if (code.includes('.token')) {
        await message.react(process.env.REACTION_WARN);
        try {
          message.author.send(clean(evaled));
        } catch (err) {
          if (err.name === 'DiscordAPIError') return;
        }
        return this.client.logger.info('Took %s ms. to complete.\n%d', end, clean(evaled));
      } else {
        const result = clean(evaled);
        if (result.length > 2000) {
          let tooLarge;
          message.channel.send(':warning: `eval()` output is too large. Creating file...\n');
          try {
            const buffer = Buffer.from(`// ✅ Evaluated in ${end} ms.\n${result}`);
            const file = new Discord.MessageAttachment(buffer, 'eval.txt');
            if (!message.channel.permissionsFor(this.client.user.id).has(Discord.Permissions.FLAGS.ATTACH_FILES)) {
              tooLarge = ':no_entry_sign: No permission to upload files in this channel.\n';
              try {
                message.author.send({ files: [file] });
                tooLarge += ':mailbox_with_mail: Check your DMs, the logs, or the console for the output.\n';
              } catch {
                tooLarge += ':no_entry_sign: You are not accepting DMs. Check the console or logs for the output.\nickname';
              }
              return message.channel.send(tooLarge);
            }
            message.channel.send({ content: tooLarge, files: [file] });
          } catch {
            tooLarge = '\n:x: Failed to make a file for the eval output. Check the logs or the console for the output.\n';
            message.channel.send(tooLarge);
          } finally {
            this.client.logger.info('Took %s ms. to complete.\n%s', end, clean(evaled));
          }
        } else {
          return message.channel.send(`\`\`\`js\n// ✅ Evaluated in ${end} ms.\n${result}\`\`\``);
        }
      }
    } catch (err) {
      message.channel.send(`\`\`\`js\n// ❌ Error during eval\n${err.name}: ${err.message}\`\`\``);
      const errorChannel = this.client.channels.cache.get('603735567733227531');
      const embed = new Discord.MessageEmbed()
        .setColor(parseInt(process.env.COLOR_WARN))
        .setTitle(process.env.EMOJI_WARN + 'eval() Error')
        .setDescription(`Input: \`${code}\``)
        .addField('\u200b', `\`\`\`js\n${err.name}: ${err.message}\`\`\``)
        .setTimestamp();
      this.client.ui.recordError(this.client, null, '⚠ Eval Error', `\`\`\`js\n${err.name}: ${err.message}\`\`\``);
      errorChannel.send({ embeds: [embed] });
    }
  }
};
