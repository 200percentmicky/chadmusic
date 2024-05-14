/// ChadMusic - The Chad Music Bot
/// Copyright (C) 2024  Micky | 200percentmicky
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

const { Listener } = require('discord-akairo');
const { PermissionsBitField } = require('discord.js');
const CMPlayerWindow = require('../modules/CMPlayerWindow');

module.exports = class ListenerAddList extends Listener {
    constructor () {
        super('addList', {
            emitter: 'player',
            event: 'addList'
        });
    }

    async exec (queue, playlist) {
        const channel = queue.textChannel;
        const guild = channel.guild;
        const member = channel.guild.members.cache.get(queue.songs[queue.songs.length - 1].user.id);

        const window = new CMPlayerWindow()
            .color(guild.members.me.displayColor !== 0 ? guild.members.me.displayColor : null)
            .windowTitle(`Playlist added to queue - ${member.voice.channel.name}`, guild.iconURL({ dynamic: true }))
            .trackTitle(`[${playlist.name}](${playlist.url})`)
            .trackImage('small', playlist.thumbnail)
            .setFooter(`${playlist.user.globalName} - ${playlist.user.tag.replace(/#0{1,1}$/, '')}`, playlist.user.avatarURL({ dynamic: true }));

        const embedFields = [];

        // Cut some or many entries if maxQueueLimit is in place.
        const djRole = this.client.settings.get(channel.guild.id, 'djRole');
        const dj = member.roles.cache.has(djRole) || channel.permissionsFor(member.user.id).has(PermissionsBitField.Flags.ManageChannels);
        if (!dj) {
            const maxQueueLimit = this.client.settings.get(channel.guild.id, 'maxQueueLimit');
            if (maxQueueLimit) {
                const queueLength = queue.songs.length - playlist.songs.length; // The length before the playlist was added.
                const allowedLimit = queueLength + maxQueueLimit; // The result of the added playlist if maxQueueLimit is in place.

                // The queue has the currently playing song as the first element
                // in the array, so we don't need to subtract the number to get
                // the correct element.
                queue.songs.splice(allowedLimit, playlist.songs.length - maxQueueLimit);

                embedFields.push({
                    name: '🔢 Number of entries',
                    value: `${playlist.songs.length}`
                });
                embedFields.push({
                    name: ':warning: Not everything was added!',
                    value: `Due to limits set on this server, only the first ${maxQueueLimit > 1 ? `**${maxQueueLimit}** entries` : 'entry'}** out of **${playlist.songs.length}** were added to the queue.`
                });
                window.addFields(embedFields);
                return channel.send({ embeds: [window._embed] });
            }
        } else {
            embedFields.push({
                name: '🔢 Number of entries',
                value: `${playlist.songs.length}`
            });
            window.addFields(embedFields);

            try {
                playlist.metadata?.ctx.send({ embeds: [window._embed] });
            } catch {
                channel.send({ embeds: [window._embed] });
            }
        }
    }
};
