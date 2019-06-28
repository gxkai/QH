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

@tagsAll(['Workorder'])
class WorkorderRouter {
  @request('POST', '/workorder')
  @summary('create')
  @description('create')
  @body({})
  static async create(ctx) {
    const { app } = ctx
    const { product: materialNo } = ctx.validatedBody
    const { caseName } = await app.db.model.Bom.findOne({ materialNo })
    const sn = app.lib.util.getWorkorderSn()
    ctx.validatedBody = Object.assign(ctx.validatedBody, {
      sn,
      caseName
    })
    const result = await app.db.model.Workorder.create(ctx.validatedBody)
    ctx.body = { result }
    ctx.status = 200
  }
  @request('PUT', '/workorder/{_id}')
  @summary('update')
  @description('update')
  @body({})
  @path({
    _id: { type: 'string', required: true }
  })
  static async update(ctx) {
    const { app } = ctx
    const { _id } = ctx.validatedParams
    const { product, caseName } = ctx.validatedBody
    const result = await app.db.model.Workorder.findByIdAndUpdate(_id, {
      product,
      caseName
    })
    ctx.body = { result }
    ctx.status = 200
  }
  @request('DELETE', '/workorder/{_id}')
  @summary('delete')
  @description('delete')
  @path({
    _id: { type: 'string', required: true }
  })
  static async delete(ctx) {
    const { app } = ctx
    const { _id } = ctx.validatedParams
    const result = await app.db.model.Workorder.deleteById(_id)
    ctx.body = { result }
    ctx.status = 200
  }
  @request('GET', '/workorder')
  @summary('findPage')
  @description('findPage')
  @query({
    pageSize: { type: 'number', required: false, default: 15 },
    currentPage: { type: 'number', required: false, default: 1 }
  })
  static async findPage(ctx) {
    const { app } = ctx
    const [data, total] = await app.dao.workorder.findPage(ctx.validatedQuery)
    ctx.body = { total, data }
    ctx.status = 200
  }
  @request('GET', '/workorder/{_id}')
  @summary('findOne')
  @description('findOne')
  @path({ _id: { type: 'string', required: true } })
  static async findOne(ctx) {
    const { app } = ctx
    const { _id } = ctx.validatedParams
    const result = await app.db.model.Workorder.findById(_id).populate({
      path: 'goodsSpec',
      populate: {
        path: 'goods'
      }
    })
    console.info(result)
    ctx.body = { result }
    ctx.status = 200
  }
}
export default WorkorderRouter
