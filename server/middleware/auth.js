module.exports = async function(ctx, next) {
  console.log(1111)
  ctx.logger.info('1111111')
  const { app } = ctx
  const sessionKey = ctx.get('x-session')
  console.log(sessionKey)
  ctx.logger.debug(`[auth] 获取到到sessionKey为${sessionKey}`)
  if (!sessionKey) {
    ctx.throw(401, '请求头中未包含x-session')
  }
  const user = await app.service.user.findBySessionKey({ ctx, sessionKey })
  if (user) {
    ctx.logger.debug(
      `[auth] 根据sessionKey查询到的用户为${JSON.stringify(user)}`
    )
    ctx.state.user = user
  } else {
    ctx.logger.info(`[auth] 根据sessionKey未获取到用户`)
    ctx.throw(401, 'session 过期')
  }
  await next()
}
