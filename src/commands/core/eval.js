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

const { Command } = require('discord-akairo');

/* eslint-disable no-unused-vars */
const Discord = require('discord.js');
const _ = require('lodash');
const __ = require('underscore');
const prettyBytes = require('pretty-bytes');
const prettyMs = require('pretty-ms');
const colonNotation = require('colon-notation');
const commonTags = require('common-tags');
const Genius = require('genius-lyrics');

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
        \`commonTags\` - common-tags
        \`Genius\` - genius-lyrics`
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
            let evaled = await eval(code);

            if (typeof evaled !== 'string') {
                evaled = require('util').inspect(evaled, { depth: 1, sorted: true, maxArrayLength: 5 });
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
                        const file = new Discord.MessageAttachment(buffer, 'eval_output.json');
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
        }
    }
};
