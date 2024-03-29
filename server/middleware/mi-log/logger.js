const log4js = require('log4js')
const access = require('./access.js')
const methods = ['trace', 'debug', 'info', 'warn', 'error', 'fatal', 'mark']

const baseInfo = {
  appLogLevel: 'error',
  dir: 'logs',
  env: 'dev',
  projectName: 'koa2-mes',
  serverIp: '0.0.0.0'
}

module.exports = options => {
  const contextLogger = {}
  const appenders = {}

  const opts = Object.assign({}, baseInfo, options || {})
  const { env, appLogLevel, dir, serverIp, projectName } = opts
  const commonInfo = { projectName, serverIp }

  appenders.cheese = {
    type: 'dateFile',
    filename: `${dir}/task`,
    pattern: '-yyyy-MM-dd.log',
    alwaysIncludePattern: true,
    layout: { type: 'messagePassThrough' }
  }

  appenders.out = {
    type: 'stdout'
  }
  const config = {
    pm2: true,
    pm2InstanceVar: 'INSTANCE_ID',
    disableClustering: true,
    appenders,
    categories: {
      default: {
        appenders: Object.keys(appenders),
        level: appLogLevel
      }
    }
  }

  const logger = log4js.getLogger('cheese')

  return async (ctx, next) => {
    const start = Date.now()
    log4js.configure(config)
    methods.forEach((method, i) => {
      contextLogger[method] = message => {
        logger[method](access(ctx, message, commonInfo))
      }
    })
    ctx.logger = logger
    ctx.log = contextLogger

    await next()
    const responseTime = Date.now() - start
    let LoginID = ''
    if (ctx.session && ctx.session.authUser) {
      LoginID = ctx.session.authUser.LoginID
    }
    const log = access(
      ctx,
      {
        actionUser: LoginID,
        responseTime: `响应时间为${responseTime / 1000}s`
      },
      commonInfo
    )
    const { app } = ctx
    const { method, url } = ctx.request
    ctx.logger.info(`${method} ${url}`)
  }
}
