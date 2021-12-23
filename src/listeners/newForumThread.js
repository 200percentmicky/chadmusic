const { oneLine } = require('common-tags');
const { Listener } = require('discord-akairo');
const { Permissions } = require('discord.js');

module.exports = class ListenerNewForumThread extends Listener {
  constructor () {
    super('newForumThread', {
      emitter: 'client',
      event: 'messageCreate'
    });
  }

  async exec (message) {
    if (message.author.bot) return;
    const forumChannels = this.client.settings.get(message.guild.id, 'forumChannels') ?? undefined;
    if (!forumChannels) return;

    if (forumChannels.includes(message.channel.id)) {
      if (!message.channel.permissionsFor(this.client.user.id).has(Permissions.FLAGS.CREATE_PUBLIC_THREADS)) {
        return this.client.ui.reply(message, 'warn', oneLine`Since this channel is a **forum channel**, I attempted 
        to create a new thread with the message you provided. However, I don\'t have the **Create Public Threads** 
        permission. Please notify the server administrators about this immediately!
        `).then(msg => {
          setTimeout(() => {
            msg.delete();
          }, 20000);
        });
      }

      if (!message.channel.rateLimitPerUser) {
        if (!message.channel.permissionsFor(this.client.user.id).has(Permissions.FLAGS.MANAGE_CHANNELS)) {
          // Passing...
        } else {
          message.channel.setRateLimitPerUser(
            600,
            "It's dangerous to not have slowmode enabled in forum channels. 10 minutes should be fine."
          );
        }
      }

      return message.startThread({
        name: `${message.author.tag} | ${message.content}`,
        reason: `Thread created by ${message.member.user.tag}`
      });
    }
  }
};
