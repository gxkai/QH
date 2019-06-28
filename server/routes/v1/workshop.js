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

@tagsAll(['Workshop'])
class WorkShopRouter {
  @request('POST', '/workshop')
  @summary('create')
  @description('create')
  @body({
    name: { type: 'string', required: true },
    factory: { type: 'string', required: true }
  })
  static async create(ctx) {
    const { app } = ctx
    console.log(ctx.validatedBody)
    const result = await app.db.model.Workshop.create(ctx.validatedBody)
    ctx.body = { result }
    ctx.status = 200
  }
  @request('PUT', '/workshop/{_id}')
  @summary('update')
  @description('update')
  @body({
    name: { type: 'string', required: true },
    factory: { type: 'string', required: true }
  })
  @path({
    _id: { type: 'string', required: true }
  })
  static async update(ctx) {
    const { app } = ctx
    const { _id } = ctx.validatedParams
    const result = await app.db.model.Workshop.findByIdAndUpdate(
      _id,
      ctx.validatedBody
    )
    ctx.body = { result }
    ctx.status = 200
  }
  @request('DELETE', '/workshop/{_id}')
  @summary('delete')
  @description('delete')
  @path({
    _id: { type: 'string', required: true }
  })
  static async delete(ctx) {
    const { app } = ctx
    const { _id } = ctx.validatedParams
    const result = await app.db.model.Workshop.deleteById(_id)
    ctx.body = { result }
    ctx.status = 200
  }
  @request('GET', '/workshop')
  @summary('findPage')
  @description('findPage')
  @query({
    pageSize: { type: Number, required: false, default: 15 },
    currentPage: { type: Number, required: false, default: 1 },
    name: { type: String, required: false },
    factory: { type: String, required: false }
  })
  static async findPage(ctx) {
    const { app } = ctx
    const [data, total] = await app.dao.workshop.findPage(ctx.validatedQuery)
    ctx.body = { total, data }
    ctx.status = 200
  }
  @request('GET', '/workshop/{_id}')
  @summary('findOne')
  @description('findOne')
  @path({ _id: { type: 'string', required: true } })
  static async findOne(ctx) {
    const { app } = ctx
    const { _id } = ctx.validatedParams
    const result = await app.db.model.workshop.findById(_id)
    ctx.body = { result }
    ctx.status = 200
  }
}
export default WorkShopRouter
