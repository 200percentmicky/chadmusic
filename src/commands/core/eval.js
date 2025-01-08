/// ChadMusic - The Chad Music Bot
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

const { Command } = require('discord-akairo');

/* eslint-disable no-unused-vars */
const Discord = require('discord.js');
const _ = require('lodash');
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
                **Loaded Variables:**
                \`Discord\` - discord.js
                \`player\` - Active player in the server, if any.
                \`queue\` - Queue of active player, if any.
                \`message\` - Message object
                \`_\` - lodash
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
        // Safety measure.
        if (!process.env.USE_EVAL) {
            return message.reply(commonTags.oneLine`
                ${process.env.EMOJI_INFO} The \`eval\` command is currently disabled. If you need to use this command, you can
                enable it through the bot's environment variables by setting **USE_EVAL** to \`true\`.` + '\n' + commonTags.oneLine`
                ${process.env.EMOJI_WARN} Do not enable this command unless you know what you're doing. If someone is telling you
                to enable it to have you run something, you're most likely being scammed.
            `);
        }

        const player = this.client.player;
        let queue;
        try {
            queue = player.getQueue(message.guild);
        } catch {}
        /* eslint-enable no-unused-vars */

        const clean = text => {
            if (typeof (text) === 'string') { return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203)); } else { return text; }
        };

        // const args = message.content.split(/ +/g)
        const code = args.code?.replace(/```/gm, '') ?? undefined;

        const closeButton = new Discord.ButtonBuilder()
            .setCustomId('close_eval')
            .setStyle(Discord.ButtonStyle.Danger)
            .setEmoji('✖');

        try {
            // eslint-disable-next-line no-eval
            let evaled = await eval(code);

            if (typeof evaled !== 'string') {
                evaled = require('util').inspect(evaled, { depth: 1, sorted: true, maxArrayLength: 5 });
            }

            message.channel.sendTyping();

            let result = clean(evaled);

            if (code?.match(/\.token/gmi)) {
                result = 'REACTED';
            } else {
                if (result.length > 2000) {
                    try {
                        const buffer = Buffer.from(`${result}`);
                        const timestamp = new Date();

                        const file = new Discord.AttachmentBuilder(buffer, { name: `eval_${timestamp}.txt` });
                        if (!message.channel.permissionsFor(this.client.user.id).has(Discord.PermissionsBitField.Flags.AttachFiles)) {
                            try {
                                await message.member.user.send({ files: [file] });
                            } catch {
                                return message.reply(':no_entry_sign: You are not accepting DMs. Check the console or logs for the output.');
                            }
                        }
                        return message.reply({ files: [file], components: [new Discord.ActionRowBuilder().addComponents(closeButton)] });
                    } catch {
                        return message.reply(':x: Failed to make a file for the eval output. Check the logs or the console for the output.');
                    } finally {
                        this.client.logger.info(`${clean(evaled)}`);
                    }
                } else {
                    return message.reply({ content: `\`\`\`js\n${result}\`\`\``, components: [new Discord.ActionRowBuilder().addComponents(closeButton)] });
                }
            }
        } catch (err) {
            message.reply({ content: `\`\`\`js\n${err.name}: ${err.message}\`\`\``, components: [new Discord.ActionRowBuilder().addComponents(closeButton)] });
        }
    }
};
