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

  app.use(async (ctx, next) => {
    const token = ctx.request.query.token
    if (token) {
      console.log(`accept token:%s`, token)
      ctx.session.token = token
      const authUser = await app.service.auth.GetUserBaseInfo(ctx)
      ctx.session.authUser = authUser
    }
    await next()
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
  // setInterval(async () => {
  //   const { _doc: appendData } = await app.db.model.ProductionLog.create({
  //     product: '1',
  //     material: '1',
  //     dosage: '1',
  //     operator: '1',
  //     result: '1',
  //     explanation: '1',
  //     line: '5d1470d905a13ac541ae3b72'
  //   })
  //   app.home.to('5d1470d905a13ac541ae3b72').emit('appendData', appendData)
  // }, 10000)

  /*
    消息推送
   */
  let $redis = require('redis')
  const sub = $redis.createClient({ db: 1, host: '139.196.102.55', port: 6379 })
  const pub = $redis.createClient({ db: 2, host: '139.196.102.55', port: 6379 })
  sub.on('connect', () => {
    console.log('sub connected ok')
  })
  sub.on('error', () => {
    console.log('sub connected error')
  })
  pub.on('connect', () => {
    console.log('sub connected ok')
  })
  pub.on('error', () => {
    console.log('sub connected error')
  })
  let msgCount = 0

  sub.on('subscribe', function(channel, count) {
    pub.publish('a nice channel', 'I am sending a message.')
    pub.publish('a nice channel', 'I am sending a second message.')
    pub.publish('a nice channel', 'I am sending my last message.')
  })

  sub.on('message', function(channel, message) {
    console.log('sub channel ' + channel + ': ' + message)
    msgCount += 1
    if (msgCount === 3) {
      sub.unsubscribe()
      sub.quit()
      pub.quit()
    }
  })
  sub.subscribe('a nice channel')

  // 增加错误的监听处理
  app.on('error', (err, ctx) => {
    if (ctx && ctx.log && ctx.log.error) {
      if (!ctx.state.logged) {
        ctx.log.error(err.stack)
      }
    }
  })
}
