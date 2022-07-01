/**
 *  Micky-bot
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

const { SlashCommand, CommandOptionType } = require('slash-create');
const { DiceRoll } = require('@dice-roller/rpg-dice-roller');
const { MessageButton, MessageActionRow } = require('discord.js');

class CommandFun extends SlashCommand {
    constructor (creator) {
        super(creator, {
            name: 'fun',
            description: 'Fun commands that anyone can use.',
            options: [
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'eightball',
                    description: 'Ask the magic 8ball a yes or no question.',
                    options: [
                        {
                            type: CommandOptionType.STRING,
                            name: 'question',
                            description: 'The question to ask the 8ball.',
                            required: true
                        }
                    ]
                },
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'roll',
                    description: 'Roll some dice.',
                    options: [
                        {
                            type: CommandOptionType.STRING,
                            name: 'notation',
                            description: 'The notation to roll. Works for D&D 5th Edition.',
                            required: true
                        }
                    ]
                }
            ]
        });

        this.filePath = __filename;
    }

    async run (ctx) {
        const guild = await this.client.guilds.cache.get(ctx.guildID);

        switch (ctx.subcommands[0]) {
        case 'eightball': {
            const responses = [
                'It is certain.',
                'It is decidedly so.',
                'Without a doubt.',
                'Yes definitely.',
                'You may rely on it.',
                'As I see it, yes.',
                'Most likely.',
                'Outlook good.',
                'Yes.',
                'Signs point to yes.',
                'Reply hazy, try again.',
                'Ask again later.',
                'Better not tell you now.',
                'Cannot predict now.',
                'Concentrate and ask again.',
                "Don't count on it.",
                'My reply is no.',
                'My sources say no.',
                'Outlook not so good.',
                'Very doubtful.'
            ];
            const answer = responses[Math.floor(Math.random() * responses.length)];

            this.client.ui.ctxCustom(
                ctx,
                '❓',
                guild.me.displayColor !== 0 ? guild.me.displayColor : null,
                `${ctx.options.eightball.question}\n\n➡ ${answer}`
            );
            break;
        }

        case 'roll': {
            const notation = ctx.options.roll.notation;

            const helpButton = new MessageActionRow()
                .addComponents(new MessageButton()
                    .setCustomId('dice_help_button')
                    .setEmoji('❓')
                    .setLabel('Help')
                    .setStyle('SECONDARY')
                );

            let roll;
            try {
                roll = new DiceRoll(notation);
            } catch {
                return this.client.ui.ctx(ctx, 'error', `\`${notation}\` is not a valid dice notation.`, null, null, null, [helpButton]);
            }

            let nice;
            if (notation === '69d420') nice = '👍 **Nice**'; // lol

            let critFail;
            if (roll.total === roll.maxTotal) critFail = '💥 **Critical**';
            if (roll.total === roll.minTotal) critFail = '❌ **Miss**';

            return this.client.ui.ctxCustom(
                ctx,
                '🎲',
                guild.me.displayColor !== 0 ? guild.me.displayColor : null,
                `${critFail ? `${critFail}\n` : ''}${nice ? `${nice}\n` : ''}${roll.output}`,
                `${roll.total}`,
                null,
                null,
                [helpButton]
            );
        }
        }
    }
}

module.exports = CommandFun;
