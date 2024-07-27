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

module.exports = class CommandMissingPermissions extends Listener {
    constructor () {
        super('missingPermissions', {
            emitter: 'commandHandler',
            event: 'missingPermissions'
        });
    }

    async exec (message, command, type, missing) {
        /* eslint-disable quote-props */

        const permissionsBits = {
            AddReactions: 'Add Reactions',
            Administrator: 'Administrator',
            AttachFiles: 'Attach Files',
            BanMembers: 'Ban Members',
            ChangeNickname: 'Change Nickname',
            Connect: 'Connect',
            CreateInstantInvite: 'Create Instant Invite',
            CreatePrivateThreads: 'Create Private Threads',
            CreatePublicThreads: 'Create Public Threads',
            DeafenMembers: 'Deafen Members',
            EmbedLinks: 'Embed Links',
            KickMembers: 'Kick Members',
            ManageChannels: 'Manage Channels',
            ManageGuildExpressions: 'Manage Server Expressions', // This is most likely changed.
            ManageEvents: 'Manage Events',
            ManageGuild: 'Manage Server',
            ManageMessages: 'Manage Messages',
            ManageNicknames: 'Manage Nicknames',
            ManageRoles: 'Manage Roles',
            ManageThreads: 'Manage Threads',
            ManageWebhooks: 'Manage Webhooks',
            MentionEveryone: 'Mention Everyone, Here, and All Roles',
            ModerateMembers: 'Timeout Members',
            MoveMembers: 'Move Members',
            MuteMembers: 'Mute Members',
            PrioritySpeaker: 'Priority Speaker',
            ReadMessageHistory: 'Read Message History',
            RequestToSpeak: 'Request to Speak',
            SendMessages: 'Send Messages',
            SendMessagesInThreads: 'Send Messages in Threads',
            SendTTSMessages: 'Send Text-To-Speech Messages',
            SendVoiceMessages: 'Send Voice Messages',
            Speak: 'Speak',
            Stream: 'Stream',
            UseApplicationCommands: 'Use Application Commands',
            UseEmbeddedActivities: 'Use Embedded Activities',
            UseExternalEmojis: 'Use External Emojis',
            UseExternalSounds: 'Use External Sounds',
            UseExternalStickers: 'Use External Stickers',
            UseSoundboard: 'Use Soundboard',
            UseVad: 'Use Voice Activity Detection',
            ViewAuditLog: 'View Audit Log',
            ViewChannels: 'View Channel',
            ViewCreatorMonetizationAnalytics: 'View Creator Monetization Analytics', // ! Might not be a valid guild permission.
            ViewGuildInsights: 'View Guild Insights'
        };

        const formattedPerms = await missing.map(p => permissionsBits[p]).join(', ');

        if (type === 'client') {
            return this.client.ui.reply(message, 'warn', `I need the **${formattedPerms}** permission(s) to run that command.`);
        }

        if (type === 'user') {
            if (command.userPermissions === 'ADMINISTRATOR') return this.client.ui.reply(message, 'no', 'This command is only available to server administrators.');
            else return this.client.ui.reply(message, 'no', `That command requires the **${formattedPerms}** permission(s) to use.`);
        }
    }
};
