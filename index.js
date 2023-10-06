/// ChadMusic - The Chad Music Bot
/// Copyright (C) 2023  Micky D. | @200percentmicky | Micky-kun#3836
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

/* Index File */

require('dotenv').config();
const { ShardingManager } = require('discord.js');
const ChadMusic = require('./src/bot.js');
const logger = require('./src/modules/winstonLogger.js');
const { execSync } = require('child_process');

// Say hello!
const { version } = require('./package.json');
logger.info('   ________              ____  ___           _');
logger.info('  / ____/ /_  ____ _____/ /  |/  /_  _______(_)____');
logger.info(' / /   / __ \\/ __ `/ __  / /|_/ / / / / ___/ / ___/');
logger.info('/ /___/ / / / /_/ / /_/ / /  / / /_/ (__  ) / /__');
logger.info('\\____/_/ /_/\\__,_/\\__,_/_/  /_/\\__,_/____/_/\\___/');
logger.info('/////////////// The Chad Music Bot! ///////////////');
logger.info('Created by Micky D. | @200percentmicky | Micky-kun#3836');
logger.info('Bot Version: %s (Build %s)', version, execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).toString().trim());
logger.info('Loading libraries...');

if (process.versions.node.split('.')[0] < 18) {
    logger.error('ChadMusic requires Node.js 18 or later. You currently have %s installed. Please update your Node.js installation.', process.versions.node);
    process.exit(1);
}

if (process.env.SHARDING) {
    const manager = new ShardingManager('./src/bot.js', {
        token: process.env.TOKEN,
        totalShards: parseInt(process.env.SHARDS) ?? 'auto'
    });

    manager.on('shardCreate', s => logger.info('Shard %s launched.', s.id));

    manager.spawn();
} else {
    logger.info('Starting client with sharding disabled.');
    new ChadMusic().login(process.env.TOKEN);
}
