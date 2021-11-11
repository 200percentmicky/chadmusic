const { Command } = require('discord-akairo');
const { MessageAttachment, Permissions } = require('discord.js');
const gm = require('gm');
const { default: axios } = require('axios');

module.exports = class CommandJPEG extends Command {
  constructor () {
    super('jpeg', {
      aliases: ['jpeg', 'jpg'],
      category: '🖼 Images',
      description: {
        text: 'Converts image to JPEG. Can be used to alter the quality of the image.',
        usage: 'jpeg [quality:int(1-100)] -> |attachment/url|',
        details: '`[quality:int(1-100)]` The quality of the JPEG image.\n`|attachment/url|` The attachment (or last attachment) or URL that must be provided.'
      },
      clientPermissions: Permissions.FLAGS.ATTACH_FILES
    });
  }

  async exec (message) {
    const args = message.content.split(/ +/g);

    let attachment = message.attachments.first();
    if (!attachment) {
      try {
        attachment = message.channel.messages.cache.filter(m => m.attachments.size > 0).first().attachments.first();
      } catch (err) {
        console.log(err);
        return this.client.ui.reply(message, 'error', 'No attachments were found.');
      }
    }

    const imageQuality = parseInt(args[1]);
    if (imageQuality > 100 || imageQuality < 1) return this.client.ui.reply(message, 'error', 'Image quality must be between **1-100**.');

    const imageData = await axios({
      url: attachment.url,
      responseType: 'arraybuffer'
    });
    const imageBuffer = Buffer.from(imageData.data, 'binary');

    gm(imageBuffer)
      .quality(imageQuality || 1)
      .toBuffer('JPG', (err, buffer) => {
        if (err) {
          this.client.ui.reply(message, 'error', err.message);
        }
        const newJPEG = new MessageAttachment(buffer, `jpeg_${args[1]}.jpg`);

        message.uploadFile(newJPEG);
      });
  }
};
