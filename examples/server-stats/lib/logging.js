const winston = require('winston') 
const { combine, timestamp, json, colorize, printf, align } = winston.format

const logLevels = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  trace: 5,
  security: -1
};

winston.addColors({ security: "rainbow" });

const securityFilter = winston.format((info, opts) => {
  return info.level === 'security' ? info : false;
});

const logger = winston.createLogger({
  levels: logLevels,
  transports: [
    new winston.transports.Console({
      format: combine(
        timestamp({
          format: 'YYYY-MM-DD hh:mm:ss.SSS A',
        }),
        printf(options => {
        // you can pass any custom variable in options by calling
        // logger.log({level: 'debug', message: 'hi', moduleName: 'my_module' })
        return `${options.timestamp}[${options.moduleName}]  ${options.level}: ${options.message}`;
        }),
        align(), 
        colorize({ all: true })
      ),   
      level: 'info'
    }),
    new winston.transports.File({
      format: combine(
        printf(options => {
        // you can pass any custom variable in options by calling
        // logger.log({level: 'debug', message: 'hi', moduleName: 'my_module' })
        return `[${options.moduleName}] ${options.timestamp} ${options.level}: ${options.message}`;
        }),
        timestamp({
          format: 'YYYY-MM-DD hh:mm:ss.SSS A',
        }),
        json()
      ),      
      level: 'info',
      filename: "./log/testLogFile.txt"
    }),
    // security logging
    new winston.transports.File({
      format: combine(
        printf(options => {
        // you can pass any custom variable in options by calling
        // logger.log({level: 'debug', message: 'hi', moduleName: 'my_module' })
        return `[${options.moduleName}] ${options.timestamp} ${options.level}: ${options.message}`;
        }),
        securityFilter(),
        timestamp({
          format: 'YYYY-MM-DD hh:mm:ss.SSS A',
        }),
        json()
      ),      
      level: 'info',
      filename: "./log/testSecurityLogFile.txt"
    })
  ]
});

module.exports = function(name) {
  // set the default moduleName of the child
  return logger.child({moduleName: name});
}