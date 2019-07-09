const mongoose = require('mongoose')
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
const { uplader } = require('../../lib/util')

@tagsAll(['Moments'])
class MomentsRouter {
  @request('POST', '/moments')
  @summary('create')
  @description('create')
  @body({})
  @middlewares([uplader.single('file')])
  static async create(ctx) {
    const { app } = ctx
    ctx.body = null
    ctx.status = 200
  }
  @request('PUT', '/moments/{_id}')
  @summary('update')
  @description('update')
  @body({})
  @path({
    _id: { type: 'string', required: true }
  })
  static async update(ctx) {
    ctx.status = 200
  }
  @request('DELETE', '/moments/{_id}')
  @summary('delete')
  @description('delete')
  @path({
    _id: { type: 'string', required: true }
  })
  static async delete(ctx) {
    const { app } = ctx
    const { _id } = ctx.validatedParams
    const result = await app.db.model.Moments.deleteById({ _id })
    ctx.body = { result }
    ctx.status = 200
  }
  @request('GET', '/moments')
  @summary('findPage')
  @description('findPage')
  @query({
    pageSize: { type: 'number', required: false, default: 15 },
    currentPage: { type: 'number', required: false, default: 1 }
  })
  static async findPage(ctx) {
    ctx.status = 200
  }
  @request('GET', '/moments/{_id}')
  @summary('findOne')
  @description('findOne')
  @path({ _id: { type: 'string', required: true } })
  static async findOne(ctx) {
    const { app } = ctx
    const { _id } = ctx.validatedParams
    const result = await app.db.model.Moments.findById(_id)
    ctx.body = { result }
    ctx.status = 200
  }
}
export default MomentsRouter
