const { oneLine } = require('common-tags');
const { Permissions } = require('discord.js');
const { SlashCommand, CommandOptionType } = require('slash-create');

class CommandPing extends SlashCommand {
  constructor (creator) {
    super(creator, {
      name: 'bassboost',
      description: "Adjust the player's bass.",
      options: [
        {
          type: CommandOptionType.STRING,
          name: 'gain',
          required: true,
          description: 'Bass gain. Must be between 1-100 or off.'
        }
      ]
    });

    this.filePath = __filename;
  }

  async run (ctx) {
    const channel = this.creator.client.channels.cache.get(ctx.channelID);
    const guild = this.creator.client.guilds.cache.get(ctx.guildID);
    const member = await guild.members.fetch(ctx.member.user.id);
    const djMode = this.creator.client.settings.get(guild.id, 'djMode');
    const djRole = this.creator.client.settings.get(guild.id, 'djRole');
    const allowFilters = this.creator.client.settings.get(guild.id, 'allowFilters');
    const dj = member.roles.cache.has(djRole) ||
      channel.permissionsFor(member.user.id).has(Permissions.FLAGS.MANAGE_CHANNELS);

    if (djMode) {
      if (!dj) {
        const embed = {
          color: process.env.COLOR_NO,
          description: oneLine`${process.env.EMOJI_NO} DJ Mode is currently active. You must have the DJ Role or the **Manage Channels** 
          permission to use music commands at this time.`
        };
        return ctx.send({ embeds: [embed], ephemeral: true });
      }
    }

    if (allowFilters === 'dj') {
      if (!dj) {
        const embed = {
          color: process.env.COLOR_NO,
          description: 'You must have the DJ Role or the **Manage Channels** permission to use filters.'
        };
        return ctx.send({ embeds: [embed], ephemeral: true });
      }
    }

    const vc = member.voice.channel;
    if (!vc) return ctx.send(`${process.env.EMOJI_ERROR} You are not in a voice channel.`, { ephemeral: true });

    const queue = this.creator.client.player.getQueue(guild.id);
    if (!queue) return ctx.send(`${process.env.EMOJI_WARN} Nothing is currently playing on this server.`, { ephemeral: true });

    const currentVc = this.creator.client.vc.get(vc);
    if (currentVc) {
      if (ctx.options.gain === 'OFF'.toLowerCase()) {
        try {
          await this.creator.client.player.setFilter(guild.id, 'bassboost', false);
          return ctx.send('📢 **Bass Boost** Off');
        } catch (err) {
          return ctx.send(`${process.env.EMOJI_ERROR} **Bass Boost** is not applied to the player.`, { ephemeral: true });
        }
      } else {
        const gain = parseInt(ctx.options.gain);

        if (gain < 1 || gain > 100 || isNaN(gain)) {
          return ctx.send(`${process.env.EMOJI_ERROR} Bass gain must be between **1** to **100**, or **"off"**.`, { ephemeral: true });
        }

        await this.creator.client.player.setFilter(guild.id, 'bassboost', `bass=g=${gain}`);
        return ctx.send(`📢 **Bass Boost** Gain \`${gain}dB\``);
      }
    } else {
      if (vc.id !== currentVc.channel.id) {
        return ctx.send(`${process.env.EMOJI_ERROR} You must be in the same voice channel that I'm in to use that command.`, { ephemeral: true });
      }
    }
  }
}

module.exports = CommandPing;
