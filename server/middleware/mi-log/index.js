const logger = require('./logger')

/**
 * 中间件错误处理
 *
 * @param {any} options
 * @returns
 */
module.exports = options => {
  const loggerMiddleware = logger(options)

  return (ctx, next) => {
    return loggerMiddleware(ctx, next).catch(e => {
      ctx.log.error(e.toString())
      ctx.status = e.status || 400
      ctx.body = { msg: e.toString() }
    })
  }
}
