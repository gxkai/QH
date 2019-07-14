const path = require('path')
const ip = require('ip')
const session = require('koa-session')
const VueView = require('koa-vue-view')
const IO = require('koa-socket-2')
const miLog = require('./mi-log')
// 引入规则中件间
const miRule = require('./mi-rule')

module.exports = app => {
  app.use(VueView({ methodName: 'render' }))
  app.use(
    miLog({
      env: app.env,
      projectName: 'mes',
      appLogLevel: 'debug',
      dir: 'logs',
      serverIp: ip.address()
    })
  )
  // session
  app.keys = ['some session']

  const CONFIG = {
    key: 'SESSION' /** (string) cookie key (default is koa:sess) */,
    /** (number || 'session') maxAge in ms (default is 1 days) */
    /** 'session' will result in a cookie that expires when session/browser is closed */
    /** Warning: If a session cookie is stolen, this cookie will never expire */
    maxAge: 86400000,
    overwrite: true /** (boolean) can overwrite or not (default true) */,
    httpOnly: true /** (boolean) httpOnly or not (default true) */,
    signed: true /** (boolean) signed or not (default true) */,
    rolling: false /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. default is false **/
  }
  app.use(session(CONFIG, app))

  miRule({
    app,
    rules: [
      {
        path: path.join(__dirname, '../service'),
        name: 'service'
      },
      {
        path: path.join(__dirname, '../db/dao'),
        name: 'dao'
      },
      {
        path: path.join(__dirname, '../db'),
        name: 'db'
      },
      {
        path: path.join(__dirname, '../lib'),
        name: 'lib'
      }
    ]
  })

  /*
    socket.io
   */
  const chat = new IO({
    namespace: 'chat'
  })
  const home = new IO({
    namespace: 'home'
  })
  chat.attach(app)
  home.attach(app)
  const redis = require('socket.io-redis')
  const url = require('url')
  app._io.adapter(redis({ host: '139.196.102.55', port: 6379 }))
  // chat
  chat.on('connection', ctx => {
    console.log('io ok')
    const roomId = url.parse(ctx.socket.request.url, true).query.roomId
    ctx.socket.join(roomId)
    ctx.socket.emit('news', '111')
  })
  chat.on('message', (ctx, data) => {
    console.log(ctx.socket.rooms)
    app.chat.to('1').emit('news', '333')
  })
  // home
  home.on('connection', async ctx => {
    console.log('io ok')
    const roomId = url.parse(ctx.socket.request.url, true).query.roomId
    ctx.socket.join(roomId)
    const initData = await app.db.model.ProductionLog.find({ line: roomId })
      .sort({
        updatedAt: -1
      })
      .limit(10)
    ctx.socket.emit('initData', initData)
  })

  // 增加错误的监听处理
  app.on('error', (err, ctx) => {
    if (ctx && ctx.log && ctx.log.error) {
      if (!ctx.state.logged) {
        ctx.log.error(err.stack)
      }
    }
  })
}
