const { Command } = require('discord-akairo')
const { MessageEmbed } = require('discord.js')
const { stripIndents } = require('common-tags')

module.exports = class CommandServerInfo extends Command {
  constructor () {
    super('serverinfo', {
      aliases: ['serverinfo', 'server', 'si'],
      category: '🔧 Tools',
      clientPermissions: ['EMBED_LINKS'],
      description: {
        text: 'Get information about the server.'
      },
      channelRestriction: 'guild'
    })
  }

  async exec (message) {
    const owner = message.guild.members.cache.get(message.guild.ownerID)
    // const roles = message.guild.roles.cache.size
    const emojis = message.guild.emojis.cache.map(emojis => emojis).join(' ')
    const verifyLevels = {
      NONE: 'None',
      LOW: 'Low',
      MEDIUM: 'Medium',
      HIGH: '(╯°□°）╯︵ ┻━┻',
      VERY_HIGH: '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻'
    }
    const filterLevels = {
      DISABLED: 'Disabled',
      MEMBERS_WITHOUT_ROLES: 'Level 1 - Members without a role.',
      ALL_MEMBERS: 'Level 2 - All members.'
    }
    const serverRegion = {
      'us-south': ':flag_us: US South',
      'us-east': ':flag_us: US East',
      'us-central': ':flag_us: US Central',
      'us-west': ':flag_us: US West',
      japan: ':flag_jp: Japan',
      hongkong: ':flag_hk: Hong Kong',
      southafrica: ':flag_sa: South Africa',
      europe: ':flag_eu: Europe',
      sydney: ':flag_au: Sydney',
      brazil: ':flag_br: Brazil',
      india: ':flag_in: India',
      singapore: ':flag_sg: Singapore',
      russia: ':flag_ru: Russia'
    }
    const embed = new MessageEmbed()
      .setColor(this.client.utils.randColor())
      .setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true }))
      .setTitle(`🆔 \`${message.guild.id}\``)
      .setDescription(emojis)
      .setThumbnail(message.guild.bannerURL({ dynamic: true }) !== null ? message.guild.bannerURL({ dynamic: true }) : message.guild.iconURL({ dynamic: true }) + '?size=2048')
      .setImage(message.guild.splashURL({ dynamic: true }) !== null ? message.guild.splashURL({ dynamic: true }) : '')
      .addField('ℹ General', stripIndents`
      **Owner**: ${owner.user.tag} (\`${owner.id}\`)
      **Date Created:** ${this.client.moment(message.guild.createdTimestamp).format('LLLL')} - ${this.client.moment(message.guild.createdTimestamp).fromNow()}
      **Region:** ${serverRegion[message.guild.region]}
      `)
      // .addField('✨ Date Created:', `${this.client.moment(message.guild.createdTimestamp).format('LLLL')}\n${this.client.moment(message.guild.createdTimestamp).fromNow()}`, true)
      // .addField('👑 Owner', `${owner.toString()}\n**${owner.tag}**\n\`${owner.id}\``, true)
      .addField(':person_raising_hand: Members', `${message.guild.members.cache.size}`, true)
      .addField('🔐 Security', `**Verification Level:** ${verifyLevels[message.guild.verificationLevel]}\n**Content Filter:** ${filterLevels[message.guild.explicitContentFilter]}`, true)
      // .addField('🏷 Roles', roles)
    message.channel.send({ embed: [embed] }) // A work in progress...
  }
}
