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

const { SlashCommand, ApplicationCommandType } = require('slash-create');

class ContextMenuGetInfo extends SlashCommand {
    constructor (creator) {
        super(creator, {
            name: 'Get Info',
            type: ApplicationCommandType.USER,
            description: 'Shows information about the user.',
            deferEphemeral: true
        });

        this.filePath = __filename;
    }

    async run (ctx) {
        const guild = this.creator.client.guilds.cache.get(ctx.guildID);
        const member = await guild.members.fetch({ user: ctx.targetMember.id, withPresences: true });
        const roles = member.roles.cache.map(x => `<@&${x.id}>`).join(' ');

        const onlineStatus = {
            online: '<:online:749221433552404581> **Online**',
            idle: '<:idle:749221433095356417> **Idle**',
            dnd: '<:do_not_disturb:749221432772395140> **Do Not Disturb**',
            offline: '<:offline:749221433049088082> **Offline**'
        };
        const whatDevice = {
            web: '🌎',
            mobile: '<:mobile:749067110931759185>',
            desktop: '💻'
        };

        const userFlags = {
            DISCORD_EMPLOYEE: '<:discord_employee:848556248832016384> This member is Discord Staff.',
            PARTNERED_SERVER_OWNER: '<:discord_partner:848556249192202247> This member is a partnered server owner.',
            HYPESQUAD_EVENTS: '<:hypesquad_events:706198537049866261> This member participates in Hypesquad Events.',
            BUGHUNTER_LEVEL_1: '<:bug_hunter_lvl1:848556247632052225> This member is a Level 1 Bug Hunter.',
            HOUSE_BRAVERY: '<:hypesquad_bravery:706198532998299779> This member is in the House of Bravery.',
            HOUSE_BRILLIANCE: '<:hypesquad_briliance:706198535846101092> This member is in the House of Brilliance.',
            HOUSE_BALANCE: '<:hypesquad_balance:706198531538550886> This member is in the House of Balance.',
            EARLY_SUPPORTER: '<:early_supporter:706198530837970998> This member is an early supporter.',
            TEAM_USER: '<:humans:724948692242792470> This bot\'s application is owned by a team.',
            BUGHUNTER_LEVEL_2: '<:bug_hunter_lvl2:706199712402898985> This member is a Level 2 Bug Hunter.',
            VERIFIED_BOT: '<:verified_bot:848557763328344064> This bot is verified.',
            EARLY_VERIFIED_BOT_DEVELOPER: '<:early_verified_bot_developer:706198727953612901> This member is an early verified bot developer.',
            DISCORD_CERTIFIED_MODERATOR: '<:discord_certified_moderator:848556248357273620> This member is certified moderator.'
        };

        const userFlagsMap = member.user.flags.toArray().map(x => userFlags[x]).join('\n');
        const memberGuildJoined = parseInt(Math.floor(member.joinedAt.getTime() / 1000));
        const memberCreated = parseInt(Math.floor(member.user.createdAt.getTime() / 1000));
        const guildOwner = guild.ownerId === member.user.id ? '<:owner:725387683811033140> This member owns this server.\n' : '';
        const botAccount = member.user.bot ? '<:bot:848557763172892722> This member is a bot.\n' : '';
        const premiumMember = member.premiumSince ? `<:booster:710871139227795487> This member boosted this server on <t:${parseInt(Math.floor(member.premiumSince.getTime() / 1000))}:F>.\n` : '';

        const embed = {
            color: parseInt(member.displayColor),
            author: {
                name: `${member.user.username}#${member.user.discriminator}${member.nickname ? ` - ${member.nickname}` : ''}`,
                icon_url: member.user.avatarURL({ dynamic: true })
            },
            description: `${whatDevice[member.presence?.clientStatus] ?? ''}${onlineStatus[member.presence?.status ?? 'offline']}\n**:shield: Roles**\n${roles}`,
            thumbnail: {
                url: member.user.avatarURL({ dynamic: true })
            },
            timestamp: new Date(),
            fields: [
                {
                    name: '✨ Account created',
                    value: `<t:${memberCreated}:F>`,
                    inline: true
                },
                {
                    name: ':inbox_tray: Joined server on',
                    value: `<t:${memberGuildJoined}:F>`,
                    inline: true
                }
            ],
            footer: {
                text: `User ID: ${member.id}`
            }
        };

        if (member.voice.channel) {
            embed.fields.push({
                name: ':loud_sound: Current voice channel',
                value: `<#${member.voice.channel.id}>`
            });
        }

        embed.fields.push({
            name: `${process.env.EMOJI_INFO} Additional Info`,
            value: `${botAccount}${guildOwner}${premiumMember}${userFlagsMap}` || 'N/A'
        });

        return ctx.send({ embeds: [embed], ephemeral: true });
    }
}

module.exports = ContextMenuGetInfo;
