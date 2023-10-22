const winston = require('winston');

const customLevels = {
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        step: 3
    },
    colors: {
        error: 'red',
        warn: 'yellow',
        info: 'green',
        step: 'blue'
    }
};

winston.addColors(customLevels.colors);

const logger = winston.createLogger({
    levels: customLevels.levels,
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console({ level: 'step', format: winston.format.combine(winston.format.colorize()) })
    ],
});

module.exports = logger;
