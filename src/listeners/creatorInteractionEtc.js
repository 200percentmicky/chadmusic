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

const { Listener } = require('discord-akairo');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyled } = require('discord.js');
const { stripIndents } = require('common-tags');

module.exports = class ListenerCreatorInteractionEtc extends Listener {
    constructor () {
        super('creatorInteractionEtc', {
            emitter: 'creator',
            event: 'componentInteraction'
        });
    }

    async exec (ctx) {
        switch (ctx.customID) {
        case 'dice_help_button': {
            await ctx.defer(true);

            const diceDocumentation = new ActionRowBuilder()
                .addComponents(new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setLabel('Documentation')
                    .setEmoji('📚')
                    .setURL('https://dice-roller.github.io/documentation/guide/notation/')
                , new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setLabel('JS Math Functions')
                    .setEmoji('🔢')
                    .setURL('https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math#Static_methods')
                );

            const embed = new EmbedBuilder()
                .setColor(parseInt(process.env.COLOR_INFO))
                .setTitle('🎲 Dice Cheat Sheet')
                .addField('Dice', stripIndents`
                    Standard: \`d{n}\`
                    Percetange: \`d% [% = 1-100]\`
                    Fudge / Fate: \`dF\` \`dF.2\` \`dF.1\`
                    `)
                .addField('Modifiers', stripIndents`
                    Minimum: \`min{n}\`
                    Maximum: \`max{n}\`
                    Exploding: \`!\` / \`!{cp}\`
                     - Compounding: \`!!\` \`!!{cp}\`
                     - Penetrating: \`!p\` \`!!p\` \`!p{cp}\` \`!!p{cp} \`
                    Re-roll: \`r\` \`ro\` \`r{cp}\` \`ro{cp}\`
                    Keep: \`k{n}\` \`kh{n}\` \`kl{n}\`
                    Drop: \`d{n}\` \`dh{n}\` \`dl{n}\`
                    Target Success: \`[<,>,=]{cp}\` e.g. \`6d10<=4\` Less or equal to 4 is Success!
                    Target Failure: \`{cp}f\` e.g. \`4d6>4f<3\` Greater than 4 = Success! Less than 3 = Failure!
                    Critical Success: \`cs{cp}\` e.g. \`4d10cs>7\` Greater than 7 = Critical Success!
                    Critical Failure: \`cf{cp}\` e.g. \`4d10cf<3\` Less than 3 = Critical Failure!
                    Sorting: \`s\` \`sa\` \`sd\` | s, sa = Sort Ascending | sd = Sort Descending
                    `)
                .addField('Math', stripIndents`
                    This is mostly basic math. You can use this with notations and Compare Points (\`{cp}\`).
                    
                    \`=\` Equal to
                    \`!=\` Not equal to
                    \`<>\` Also not equal to
                    \`<\` Less than
                    \`>\` Greater than
                    \`<=\` Less than or equal to
                    \`>=\` Greater than or equal to
    
                    \`+\` Add
                    \`-\` Subtract
                    \`*\` Multiply
                    \`/\` Divide
                    \`%\` Remainder after division
                    \`^\` Exponent
                    \`**\` Also exponent
    
                    You can also use the following **[Javascript \`Math\` functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math#Static_methods)**:
                    \`abs\` \`ceil\` \`cos\` \`exp\` \`floor\` \`log\` \`max\` \`min\` \`pow\` \`round\` \`sign\` \`sin\` \`sqrt\` \`tan\`
                    `);

            await ctx.sendFollowUp({ embeds: [embed], components: [diceDocumentation], ephemeral: true });
        }
        }
    }
};
