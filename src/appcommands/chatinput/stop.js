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

const { SlashCommand } = require('slash-create');
const { ChannelType } = require('discord.js');
const CMError = require('../../lib/CMError');
const { useQueue } = require('discord-player');

class CommandStop extends SlashCommand {
    constructor (creator) {
        super(creator, {
            name: 'stop',
            description: 'Destroys the player.'
        });

        this.filePath = __filename;
    }

    async run (ctx) {
        if (ctx.channel.type === ChannelType.DM) {
            throw new CMError('NO_DMS_ALLOWED');
        }

        const client = this.creator.client;
        const guild = client.guilds.cache.get(ctx.guildID);
        const channel = await guild.channels.fetch(ctx.channelID);
        const member = await guild.members.fetch(ctx.user.id);

        const djMode = client.settings.get(ctx.guildID, 'djMode');
        const dj = await this.client.utils.isDJ(channel, member);
        if (djMode) {
            if (!dj) return this.client.ui.sendPrompt(ctx, 'DJ_MODE');
        }

        const vc = member.voice.channel;
        const textChannel = client.settings.get(ctx.guildID, 'textChannel');
        if (textChannel) {
            if (textChannel !== channel.id) {
                return this.client.ui.sendPrompt(ctx, 'WRONG_TEXT_CHANNEL_MUSIC', vc.id);
            }
        }

        if (!vc) return this.client.ui.sendPrompt(ctx, 'NOT_IN_VC');

        const queue = useQueue(guild.id);

        if (!queue || !queue.isPlaying()) {
            return this.client.ui.sendPrompt(ctx, 'NOT_PLAYING');
        } else if (!this.client.utils.isSameVoiceChannel(member)) {
            return this.client.ui.sendPrompt(ctx, 'ALREADY_SUMMONED_ELSEWHERE');
        }

        if (vc.members.size <= 2 || dj) {
            queue.node.stop();
            return this.client.ui.custom(ctx, ':stop_button:', process.env.COLOR_INFO, 'Stopped the player and cleared the queue.');
        } else {
            return this.client.ui.sendPrompt(ctx, 'NOT_ALONE');
        }
    }
}

module.exports = CommandStop;
