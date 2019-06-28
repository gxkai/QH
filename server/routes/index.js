const { SwaggerRouter } = require('koa-swagger-decorator')

const ApiRouter = require('./v1')

const router = new SwaggerRouter()

router.use('/api/v1', ApiRouter.routes())

module.exports = router
