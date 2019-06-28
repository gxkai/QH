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

@tagsAll(['Goods'])
class GoodsRouter {
  @request('POST', '/goods')
  @summary('create')
  @description('create')
  @body({
    name: { type: 'string', required: true }
  })
  static async create(ctx) {
    const { app } = ctx
    const result = await app.db.model.Goods.create(ctx.validatedBody)
    ctx.body = { result }
    ctx.status = 200
  }
  @request('PUT', '/goods/{_id}')
  @summary('update')
  @description('update')
  @body({
    name: { type: 'string', required: true }
  })
  @path({
    _id: { type: 'string', required: true }
  })
  static async update(ctx) {
    const { app } = ctx
    const { _id } = ctx.validatedParams
    const result = await app.db.model.Goods.findByIdAndUpdate(
      _id,
      ctx.validatedBody
    )
    ctx.body = { result }
    ctx.status = 200
  }
  @request('DELETE', '/goods/{_id}')
  @summary('delete')
  @description('delete')
  @path({
    _id: { type: 'string', required: true }
  })
  static async delete(ctx) {
    const { app } = ctx
    const { _id } = ctx.validatedParams
    const result = await app.db.model.Goods.deleteById({ _id })
    ctx.body = { result }
    ctx.status = 200
  }
  @request('GET', '/goods')
  @summary('findPage')
  @description('findPage')
  @query({
    pageSize: { type: Number, required: false, default: 15 },
    currentPage: { type: Number, required: false, default: 1 }
  })
  static async findPage(ctx) {
    const { app } = ctx
    const [data, total] = await app.dao.goods.findPage(ctx.validatedQuery)
    ctx.body = { total, data }
    ctx.status = 200
  }
  @request('GET', '/goods/{_id}')
  @summary('findOne')
  @description('findOne')
  @path({ _id: { type: 'string', required: true } })
  static async findOne(ctx) {
    const { app } = ctx
    const { _id } = ctx.validatedParams
    const result = await app.db.model.Goods.findById(_id)
    ctx.body = { result }
    ctx.status = 200
  }
}
export default GoodsRouter
