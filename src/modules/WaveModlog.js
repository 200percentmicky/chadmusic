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

const color = require('../colorcode.json');
const emoji = require('../emoji.json');
const { MessageEmbed, Guild, GuildMember, User } = require('discord.js');
const prettyms = require('pretty-ms');
const { stripIndents } = require('common-tags');

/**
 * Creates a case in the modlog for a server.
 * @param {Guild} guild The Guild ID where modlog cases should be recorded. Instance of 'Discord.Guild`.
 * @param {string} type The case type.
 * @param {GuildMember} modid The moderator's User ID. Instance of `Discord.GuildMember`.
 * @param {User} userid The User ID of the offender. Instance of `Discord.User`.
 * @param {string} reason The reason for the case.
 * @param {number} duration If the case type is `mute`, the duration of the mute in milliseconds.
 */
const create = async (guild, type, modid, userid, reason, duration) => {
    if (!(guild instanceof Guild)) throw new TypeError('guild must be an instance of Guild.');
    await guild.client.modlog.ensure(guild.id);
    const modlog = await guild.client.modlog.get(guild.id);
    // Gets the entire size of the guild's modlog, and parses a number for the case's creation.
    // What the fuck am I doing?
    let caseid;
    try {
        caseid = Object.keys(modlog).length;
    } catch {
        caseid = 0;
    }

    // Embed colors!
    const colors = {
        ban: color.ban,
        kick: color.kick,
        softban: color.softban,
        unban: color.unban
    };

    const moderator = guild.members.cache.get(modid); // The moderators user ID.
    if (!(moderator instanceof GuildMember)) throw new TypeError('modid must be an instance of GuildMember.');
    const user = guild.client.users.cache.find(val => val.id === userid) || 'Unknown'; // The affected users ID.
    if (!(user instanceof User)) throw new TypeError('userid must be an instance of User.');

    const _type = type.charAt(0).toUpperCase() + type.slice(1);
    const emojiType = {
        ban: '🔨',
        kick: '👢',
        softban: '💨',
        unban: '🕊',
        mute: '🔇',
        unmute: '🔊'
    };

    // Used to construct the embed.
    const prefix = guild.client.settings.get(guild.id, 'prefix') || process.env.PREFIX;
    if (!reason) reason = `No reason provided. Type \`${prefix}reason ${caseid + 1}\` to add it.`;

    const __type = `${emojiType[type]} ${_type}`;
    const __reason = `**Reason:** ${reason}`;

    const embed = new MessageEmbed()
        .setColor(colors[type])
        .setAuthor({
            name: `${moderator.user.tag}`,
            iconURL: moderator.user.avatarURL({ dynamic: true })
        })
        .setDescription(`${__reason}`)
        .setThumbnail(`${user.avatarURL({ dynamic: true })}?size=1024`)
        .addField('User', `${user.tag}`, true)
        .addField('Action', `${__type}`, true)
        .setTimestamp()
        .setFooter({
            text: `Case ${caseid + 1}`
        }); // Adds 1 from the caseid variable.

    if (type === 'mute') {
        const _duration = prettyms(duration, { verbose: true });
        embed.addField('Duration', _duration);
    }

    const modlogSetting = guild.client.settings.get(guild.id, 'modlog'); // The modlog channel.
    const modlogChannel = guild.channels.cache.get(modlogSetting); // Get's the modlog channel for the guild.

    embed.addField('ID', stripIndents`
  \`\`\`js\n
  User: ${user.id}
  Moderator: ${moderator.user.id}
  \`\`\`
  `);

    if (!modlogChannel) return; // The modlog channel doesn't exist.

    return modlogChannel.send({ embeds: [embed] }).then(msg => {
    // Adds a case into the modlog DB.
    // Then it'll be possible to retrieve the case's message ID to edit the modlog case.
        const caseObj = {
            type: type,
            mod_id: modid,
            message_id: msg.id,
            user_tag: user.tag,
            user_avatar: user.avatarURL({ dynamic: true }),
            user_id: userid,
            duration: duration || null,
            case_id: caseid + 1
        };

        guild.client.modlogCases.set(`${msg.guild.id}.${caseid + 1}`, caseObj);
    }).catch(err => {
    // Some stupid shit happened idk...
        if (err.name === 'DiscordAPIError') return;
        const errorChannel = guild.client.channels.cache.find(val => val.id === process.env.BUG_CHANNEL);
        const embed = new MessageEmbed()
            .setColor(color.error)
            .setTitle(`${emoji.error} Internal Error`)
            .setDescription(`\`\`\`js\n${err}\`\`\``)
            .setTimestamp();
        errorChannel.send({ embeds: [embed] });
    });
};

module.exports = { create };
