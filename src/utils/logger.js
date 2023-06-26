import winston from "winston";
import commander from './commander.js'
const { environment } = commander
const configEnvironment = {
    PRODUCTION: () => {
        logger = loggerProd
        return 'Environment selected is PRODUCTION'
    },
    DEVELOPMENT: () => {
        logger = loggerDev
        return 'Environment selected is DEVELOPMENT'
    }
}

const environmentUndefined = 'This environment is not defined'

const customeLevelOptions = {
    levels: {
        fatal:   0,
        error:   1,
        warning: 2,
        info:    3,
        http:    4,
        debug:   5
    },
    colors: {
        fatal:   'red',
        error:   'magenta',
        warning: 'yellow',
        info:    'blue',
        http:    'cyan',
        debug:   'white'
    }
}

export let logger

const loggerDev = winston.createLogger({
    levels: customeLevelOptions.levels,
    transports: [
        new winston.transports.Console({
            level: 'debug', 
            format: winston.format.combine(
                winston.format.colorize({
                    colors:customeLevelOptions.colors}),
                    winston.format.simple()
            )
        })
    ]
})

const loggerProd = winston.createLogger({
    levels: customeLevelOptions.levels,
    transports: [
        new winston.transports.Console({
            level: 'info', 
            format: winston.format.combine(
                winston.format.colorize({
                    colors:customeLevelOptions.colors}),
                    winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: './errors.log', 
            level: 'error',
            format: winston.format.simple()
        })
    ]
})

const configuredEnvironment = configEnvironment[environment] ? configEnvironment[environment]() : environmentUndefined

logger.info(configuredEnvironment)

const addLogger = (req, res, next) => {
    req.logger = logger
    req.logger.http(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`)
    next()
}

export default addLogger