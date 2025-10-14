/// ChadMusic
/// Copyright (C) 2025  Micky | 200percentmicky
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
const { ClusterManager } = require('discord-hybrid-sharding');
const logger = require('./src/lib/ChadLogger.js');

if (process.versions.node.split('.')[0] < 22 && process.versions.node.split('.')[1] < 12) {
    logger.error(`ChadMusic requires Node.js 22.12.0 or later. You currently have ${process.versions.node} installed. Please update your Node.js installation.`);
    process.exit(1);
}

// Say hello!
const { version } = require('./package.json');
logger.info('   ________              ____  ___           _');
logger.info('  / ____/ /_  ____ _____/ /  |/  /_  _______(_)____');
logger.info(' / /   / __ \\/ __ `/ __  / /|_/ / / / / ___/ / ___/');
logger.info('/ /___/ / / / /_/ / /_/ / /  / / /_/ (__  ) / /__');
logger.info('\\____/_/ /_/\\__,_/\\__,_/_/  /_/\\__,_/____/_/\\___/');
logger.info('Created by Micky | @200percentmicky');
logger.info(`Bot Version: ${version}`);
logger.info('Loading libraries...');

if (version.endsWith('-dev')) {
    logger.warn('This version is considered unstable. Use caution when running this version in a production environment.');
}

if (process.env.NODE_ENV && process.env.NODE_ENV !== 'production') {
    logger.warn(`NODE_ENV variable is currently set to ${process.env.NODE_ENV}. Unexpected behavior may occur.`);
}

if (process.env.YOUTUBE_COOKIE) {
    logger.warn('YOUTUBE_COOKIE environment variable has been deprecated. Please switch to the new cookie format by following the instructions at https://distube.js.org/#/docs/DisTube/main/general/cookie. Paste the new cookie in the cookies.json file.');
}

if (process.env.SHARDING) {
    logger.info('Starting client with sharding enabled.');

    const manager = new ClusterManager('./src/bot.js', {
        totalShards: parseInt(process.env.SHARDS) ?? 'auto',
        shardsPerClusters: parseInt(process.env.SHARDS_PER_CLUSTER) ?? 2,
        mode: 'process'
    });

    if (manager.totalShards === 'auto') {
        manager.token = process.env.TOKEN;
    }

    manager.on('clusterCreate', c => logger.info(`Cluster ${c.id} launched.`))
        .on('clusterReady', c => logger.info(`Cluster ${c.id} is ready.`));

    manager.spawn({ timeout: -1 });
} else {
    logger.info('Starting client with sharding disabled.');

    const ChadMusic = require('./src/bot.js');

    try {
        new ChadMusic().login(process.env.TOKEN);
    } catch (err) {
        logger.fatal(`ChadMusic failed to start! :(\n${err.stack}`);
        process.exit(1);
    }
}
