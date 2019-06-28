const {
  request,
  summary,
  body,
  tags,
  middlewares,
  path,
  description,
  query,
  deprecated,
  tagsAll,
  middlewaresAll,
  queryAll,
  deprecatedAll
} = require('koa-swagger-decorator')

@tagsAll(['ProductionLog'])
class ProductionLogRouter {
  @request('POST', '/productlog')
  @summary('create')
  @description('create')
  @body({})
  static async create(ctx) {
    const { app } = ctx
    const result = await app.db.model.ProductionLog.create(ctx.validatedBody)
    ctx.body = { result }
    ctx.status = 200
  }
  @request('PUT', '/productlog/{_id}')
  @summary('update')
  @description('update')
  @body({})
  @path({
    _id: { type: 'string', required: true }
  })
  static async update(ctx) {
    const { app } = ctx
    const { _id } = ctx.validatedParams
    const result = await app.db.model.ProductionLog.findByIdAndUpdate(
      _id,
      ctx.validatedBody
    )
    ctx.body = { result }
    ctx.status = 200
  }
  @request('DELETE', '/productlog/{_id}')
  @summary('delete')
  @description('delete')
  @path({
    _id: { type: 'string', required: true }
  })
  static async delete(ctx) {
    const { app } = ctx
    const { _id } = ctx.validatedParams
    const result = await app.db.model.ProductionLog.deleteById({ _id })
    ctx.body = { result }
    ctx.status = 200
  }
  @request('GET', '/productlog')
  @summary('findPage')
  @description('findPage')
  @query({
    pageSize: { type: 'number', required: false, default: 15 },
    currentPage: { type: 'number', required: false, default: 1 },
  })
  static async findPage(ctx) {
    const { app } = ctx
    console.log(ctx.validatedQuery)
    const [data, total] = await app.dao.productlog.findPage(ctx.validatedQuery)
    ctx.body = { total, data }
    ctx.status = 200
  }
  @request('GET', '/productlog/{_id}')
  @summary('findOne')
  @description('findOne')
  @path({ _id: { type: 'string', required: true } })
  static async findOne(ctx) {
    const { app } = ctx
    const { _id } = ctx.validatedParams
    const result = await app.db.model.ProductionLog.findById(_id)
    ctx.body = { result }
    ctx.status = 200
  }
}
export default ProductionLogRouter
