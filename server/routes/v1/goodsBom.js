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

@tagsAll(['GoodsBom'])
class GoodsBomRouter {
  @request('POST', '/goodsBom')
  @summary('create')
  @description('create')
  @body({
    goodsSpec: { type: 'string', required: true },
    subGoodsSpec: { type: 'string', required: true },
    dosage: { type: 'number', required: true }
  })
  static async create(ctx) {
    const { app } = ctx
    const result = await app.db.model.GoodsBom.create(ctx.validatedBody)
    ctx.body = { result }
    ctx.status = 200
  }
  @request('PUT', '/goodsBom/{_id}')
  @summary('update')
  @description('update')
  @body({
    goodsSpec: { type: 'string', required: true },
    subGoodsSpec: { type: 'string', required: true },
    dosage: { type: 'number', required: true }
  })
  @path({
    _id: { type: 'string', required: true }
  })
  static async update(ctx) {
    const { app } = ctx
    const { _id } = ctx.validatedParams
    const result = await app.db.model.GoodsBom.findByIdAndUpdate(
      _id,
      ctx.validatedBody
    )
    ctx.body = { result }
    ctx.status = 200
  }
  @request('DELETE', '/goodsBom/{_id}')
  @summary('delete')
  @description('delete')
  @path({
    _id: { type: 'string', required: true }
  })
  static async delete(ctx) {
    const { app } = ctx
    const { _id } = ctx.validatedParams
    const result = await app.db.model.GoodsBom.deleteById(_id)
    ctx.body = { result }
    ctx.status = 200
  }
  @request('GET', '/goodsBom')
  @summary('findPage')
  @description('findPage')
  @query({
    pageSize: { type: Number, required: false, default: 15 },
    currentPage: { type: Number, required: false, default: 1 }
  })
  static async findPage(ctx) {
    const { app } = ctx
    const [data, total] = await app.dao.goodsBom.findPage(ctx.validatedQuery)
    ctx.body = { total, data }
    ctx.status = 200
  }
  @request('GET', '/goodsBom/{_id}')
  @summary('findOne')
  @description('findOne')
  @path({ _id: { type: 'string', required: true } })
  static async findOne(ctx) {
    const { app } = ctx
    const { _id } = ctx.validatedParams
    const result = await app.db.model.GoodsBom.findById(_id)
    ctx.body = { result }
    ctx.status = 200
  }
}
export default GoodsBomRouter
