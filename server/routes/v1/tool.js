const path1 = require('path')
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

@tagsAll(['tool'])
class ToolRouter {
  @request('POST', '/tool')
  @summary('create')
  @description('create')
  @body({
    name: { type: 'string', required: true }
  })
  static async create(ctx) {
    const { app } = ctx
    const result = await app.db.model.Tool.create(ctx.validatedBody)
    ctx.body = { result }
    ctx.status = 200
  }
  @request('PUT', '/tool/{id}')
  @summary('update')
  @description('update')
  @body({
    name: { type: 'string', required: true }
  })
  @path({
    id: { type: 'string', required: true }
  })
  static async update(ctx) {
    const { app } = ctx
    const { id } = ctx.validatedParams
    const result = await app.db.model.Tool.findByIdAndUpdate(
      id,
      ctx.validatedBody
    )
    ctx.body = { result }
    ctx.status = 200
  }
  @request('DELETE', '/tool/{id}')
  @summary('delete')
  @description('delete')
  @path({
    id: { type: 'string', required: true }
  })
  static async delete(ctx) {
    const { app } = ctx
    const { id } = ctx.validatedParams
    const result = await app.db.model.Tool.deleteById(id)
    ctx.body = { result }
    ctx.status = 200
  }
  @request('GET', '/tool')
  @summary('findPage')
  @description('findPage')
  @query({
    pageSize: { type: Number, required: false, default: 15 },
    currentPage: { type: Number, required: false, default: 1 }
  })
  static async findPage(ctx) {
    const { app } = ctx
    const [data, total] = await app.dao.tool.findPage(ctx.validatedQuery)
    ctx.body = { total, data }
    ctx.status = 200
  }
  @request('GET', '/tool/select')
  @summary('findPage')
  @description('findPage')
  static async findPageSelect(ctx) {
    ctx.render(path1.resolve(__dirname, '../../views/User.vue'))
  }
  @request('GET', '/tool/{id}')
  @summary('findOne')
  @description('findOne')
  @path({ id: { type: 'string', required: true } })
  static async findOne(ctx) {
    const { app } = ctx
    const { id } = ctx.validatedParams
    const result = await app.db.model.Tool.findById(id)
    ctx.body = { result }
    ctx.status = 200
  }
}
export default ToolRouter
