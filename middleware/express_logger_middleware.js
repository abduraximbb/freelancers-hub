const winston = require('winston')
const  expressWinston = require('express-winston');
const { transports } = require('winston');

const expressWinstonErrorLogger = expressWinston.errorLogger({
  transports: [
    new transports.File({filename: "./log/error.log", level:"error"})
  ],
  format: winston.format.combine(
    winston.format.json()
  )
})

module.exports = {
  expressWinstonErrorLogger
}