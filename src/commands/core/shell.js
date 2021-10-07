const { Command } = require('discord-akairo');
const { exec } = require('child_process');

module.exports = class CommandShell extends Command {
  constructor () {
    super('shell', {
      aliases: ['shell'],
      description: {
        text: 'Execute shell precesses.',
        usage: 'shell <cmd>',
        details: '`<cmd>` The command to execute.'
      },
      category: '💻 Core',
      ownerOnly: true
    });
  }

  async exec (message) {
    const args = message.content.split(/ +/g);
    const cmd = `cd ~ && ${args.slice(1).join(' ')}`; // Run command at the user's home directory.
    const controller = new AbortController();
    const { signal } = controller;

    if (!args[1]) return this.client.ui.usage('shell <cmd>');

    // sudo must not be used outside of a terminal environment.
    if (args.includes('sudo')) {
      return message.reply({ content: '⛔ `sudo` must not be used.' });
    }

    // Must not login to root outside of a terminal environment.
    if (args.includes('su')) {
      return message.reply({ content: '⛔ You cannot login as `root`.' });
    }

    message.channel.sendTyping();

    const filter = m => m.author.id === message.author.id;
    const collector = message.channel.createMessageCollector({
      filter
    });

    collector.on('collect', async collected => {
      if (collected.content === 'kill') {
        controller.abort();
      }
    });

    exec(cmd, { signal }, (error, stdout, stderr) => {
      if (error) {
        collector.stop();
        const msg = error.name === 'AbortError'
          ? '🛑 Shell process has been aborted'
          : `❌ Invalid usage of command or command not found:\n\`\`\`\n${error}\`\`\``;
        return message.reply({ content: `${msg}` });
      }

      if (stderr) {
        console.log(stderr);
        return message.reply({ content: `⛔ Shell process returned an error:\n\`\`\`\n${stderr}\`\`\`` });
      }

      collector.stop();
      return message.reply({ content: `✅ Shell process returned without errors:\n\`\`\`\n${stdout || 'Command did not return anything.'}\`\`\`` });
    });
  }
};
