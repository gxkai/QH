const { SwaggerRouter } = require('koa-swagger-decorator')

const ApiRouter = require('./v1')

const router = new SwaggerRouter()

router.use('/wx/api/v1', ApiRouter.routes())

module.exports = router
