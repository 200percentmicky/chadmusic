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
const CMPlayerWindow = require('../modules/CMPlayerWindow');
const _ = require('lodash');
const { Events } = require('distube');

module.exports = class ListenerAddList extends Listener {
    constructor () {
        super('addList', {
            emitter: 'player',
            event: Events.ADD_LIST
        });
    }

    async exec (queue, playlist) {
        const channel = queue.textChannel;
        const guild = channel.guild;
        const member = channel.guild.members.cache.get(queue.songs[queue.songs.length - 1].user.id);
        const message = playlist.metadata?.message || playlist.metadata?.ctx;

        const window = new CMPlayerWindow()
            .color(guild.members.me.displayColor !== 0 ? guild.members.me.displayColor : null)
            .windowTitle(`Playlist added to queue - ${member.voice.channel.name}`, guild.iconURL({ dynamic: true }))
            .trackTitle(`[${playlist.name}](${playlist.url})`)
            .trackImage('small', playlist.thumbnail)
            .setFooter(`${playlist.user.globalName} - ${playlist.user.tag.replace(/#0{1,1}$/, '')}`, playlist.user.avatarURL({ dynamic: true }));

        const embedFields = [];

        embedFields.push({
            name: '🔢 Number of entries',
            value: `${playlist.songs.length}`
        }, {
            name: ':bookmark_tabs: Position',
            value: `${(queue.songs.length - 1) - (playlist.songs.length - 1)}-${queue.songs.length - 1}`
        });

        // Cut some or many entries if maxQueueLimit is in place.
        const dj = await this.client.utils.isDJ(channel, member);
        if (!dj) {
            const maxQueueLimit = this.client.settings.get(channel.guild.id, 'maxQueueLimit');
            if (maxQueueLimit) {
                const queueBefore = _.difference(queue.songs, playlist.songs); // The queue before the playlist was added.
                const queueLength = queueBefore.length; // Queue length before add.
                const queueMemberSize = queueBefore.filter(entries => entries.user.id === member.user.id).length; // How many tracks that the user added.
                const allowedLimit = maxQueueLimit - queueMemberSize; // The allowed limit.

                if (queueMemberSize > allowedLimit) {
                    if (queueLength <= 1) {
                        this.client.player.stop(guild);
                    } else {
                        const queueAfter = _.dropRight(queue.songs, playlist.songs.length);
                        queue.songs = queueAfter;
                    }
                    return this.client.ui.reply(message, 'error', `The playlist cannot be added because you already exceeded the maximum number of **${maxQueueLimit} track(s)** allowed on this server.`);
                }

                const queueAfter = _.dropRight(queue.songs, playlist.songs.length - allowedLimit);

                queue.songs = queueAfter;

                embedFields.push({
                    name: `:warning: ${playlist.songs[0].length - allowedLimit} tracks(s) were removed.`,
                    value: `You're only allowed to add **${allowedLimit}** track(s) to the queue on this server.`
                });
            }
        }

        window.addFields(embedFields);

        try {
            playlist.metadata?.ctx.send({ embeds: [window._embed] });
        } catch {
            channel.send({ embeds: [window._embed] });
        }
    }
};
