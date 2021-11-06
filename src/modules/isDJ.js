const { Permissions, BaseGuildTextChannel, GuildMember } = require('discord.js'); // eslint-disable-line no-unused-vars

/**
 * Checks if a user is a DJ in a guild.
 * @param {BaseGuildTextChannel} channel A text channel.
 * @param {GuildMember} member The guild member to check for DJ permissions.
 * @returns {boolean}
 */
const isDJ = (channel, member) => {
  const djRole = channel.client.settings.get(channel.guild.id, 'djRole');
  const permission = member.roles.cache.has(djRole) ||
    channel.permissionsFor(member.user.id).has(Permissions.FLAGS.MANAGE_CHANNELS) ||
    member.user.id === process.env.OWNER_ID;

  return permission;
};

module.exports = { isDJ };
