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

@tagsAll(['Line'])
class LineRouter {
  @request('POST', '/line')
  @summary('create')
  @description('create')
  @body({
    name: { type: 'string', required: true },
    product: { type: 'string', required: true }
  })
  static async create(ctx) {
    const { app } = ctx
    const result = await app.db.model.Line.create(ctx.validatedBody)
    ctx.body = { result }
    ctx.status = 200
  }
  @request('PUT', '/line/{_id}')
  @summary('update')
  @description('update')
  @body({
    name: { type: 'string', required: true },
    product: { type: 'string', required: true }
  })
  @path({
    _id: { type: 'string', required: true }
  })
  static async update(ctx) {
    const { app } = ctx
    const { _id } = ctx.validatedParams
    const { name, product } = ctx.validatedBody
    const result = await app.db.model.Line.findByIdAndUpdate(_id, {
      name,
      product
    })
    ctx.body = { result }
    ctx.status = 200
  }
  @request('DELETE', '/line/{_id}')
  @summary('delete')
  @description('delete')
  @path({
    _id: { type: 'string', required: true }
  })
  static async delete(ctx) {
    const { app } = ctx
    const { _id } = ctx.validatedParams
    const result = await app.db.model.Line.deleteById(_id)
    ctx.body = { result }
    ctx.status = 200
  }
  @request('GET', '/line')
  @summary('findPage')
  @description('findPage')
  @query({
    pageSize: { type: 'number', required: false, default: 15 },
    currentPage: { type: 'number', required: false, default: 1 },
    pagination: { type: 'boolean', required: false, default: true },
    name: { type: 'string', required: false },
    product: { type: 'string', required: false }
  })
  static async findPage(ctx) {
    const { app } = ctx
    const { pagination } = ctx.validatedQuery
    if (pagination) {
      const [data, total] = await app.dao.line.findPage(ctx.validatedQuery)
      ctx.body = { total, data }
    } else {
      app.lib.util.queryFilter(ctx.validatedQuery)
      const result = await app.db.model.Line.find(ctx.validatedQuery)
      ctx.body = { result }
    }
    ctx.status = 200
  }
  @request('GET', '/line/{_id}')
  @summary('findOne')
  @description('findOne')
  @path({ _id: { type: 'string', required: true } })
  static async findOne(ctx) {
    const { app } = ctx
    const { _id } = ctx.validatedParams
    const result = await app.db.model.Line.findById(_id)
      .populate({
        path: 'goodsSpec',
        populate: {
          path: 'goods'
        }
      })
      .populate('flow')
    ctx.body = { result }
    ctx.status = 200
  }
}
export default LineRouter
