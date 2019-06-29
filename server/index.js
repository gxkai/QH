const path = require('path')
const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const cors = require('koa-cors')
const result = require('dotenv').config({
  path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`)
})
if (result.error) {
  throw result.error
}
console.log(result.parsed)
const staticFiles = require('koa-static')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const { open } = require(`./db/connect`)

const app = new Koa()

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
const router = require('./routes/index')
const middleware = require('./middleware')
config.dev = !(app.env === 'production')
open()
middleware(app)
app
  .use(cors())
  .use(
    staticFiles(path.resolve(__dirname, './uploads'), {
      maxage: 30 * 24 * 60 * 60 * 1000
    })
  )
  .use(bodyParser({ multipart: true }))
  .use(router.routes())
  .use(router.allowedMethods())
async function start() {
  // Instantiate nuxt.js
  const nuxt = new Nuxt(config)

  nuxt.options.server = Object.assign(nuxt.options.server, {
    host: '0.0.0.0',
    port: process.env.HTTP_PORT
  })
  const { host = '0.0.0.0', port = process.env.HTTP_PORT } = nuxt.options.server

  // Build in development
  console.log(config.dev)
  // if (config.dev) {
  //   const builder = new Builder(nuxt)
  //   await builder.build()
  // } else {
  //   await nuxt.ready()
  // }

  app.use(ctx => {
    ctx.status = 200
    ctx.respond = false // Bypass Koa's built-in response handling
    ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
    ctx.req.session = ctx.session
    // nuxt.render(ctx.req, ctx.res)
  })

  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}

start()
