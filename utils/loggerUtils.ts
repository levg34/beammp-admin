import pino from "pino"

const transport = pino.transport({
    targets: [{
      level: 'error',
      target: 'pino/file',
      options: { destination: 'logs/error.log' }
    },{
      level: 'info',
      target: 'pino/file',
      options: { destination: 'logs/logs.log' }
    }]
  })

const logger = pino(transport)

function getLogger(file: string, context?: Record<string,any>) {
    return logger.child({file, ...context})
}

export {
    getLogger
}