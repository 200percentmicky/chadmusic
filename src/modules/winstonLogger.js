const { createLogger, format, transports } = require('winston');
const chalk = require('chalk');

// Winston Logger
const logger = createLogger({
  format: format.combine(
    format.splat(),
    format.timestamp(),
    format.label({ label: '==>' }),
    format.printf(({ timestamp, label, level, message }) => {
      return `[${timestamp}] ${label} ${level}: ${message}`;
    })
  ),
  transports: [
    new transports.File({
      filename: 'console.log'
    })
  ]
});

if (process.env.DEBUG_LOGGING === 'true') {
  logger.add(new transports.Console({
    format: format.combine(
      format.colorize(),
      format.simple(),
      format.printf(({ timestamp, label, level, message }) => {
        return `${chalk.black.cyan(`[${timestamp}]`)} ${label} ${level}: ${message}`;
      })
    )
  }));
}

module.exports = logger;
